import Pandal from '../models/Pandal.js';

// Get all Pandals
export const getPandals = async (req, res) => {
  try {
    const pandals = await Pandal.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({
      success: true,
      pandals
    });
  } catch (error) {
    console.error('Error getting pandals:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving pandals' });
  }
};

// Get Pandal by ID
export const getPandalById = async (req, res) => {
  try {
    const pandal = await Pandal.findOne({ id: req.params.id });
    if (!pandal) {
      return res.status(404).json({ success: false, message: 'Pandal not found' });
    }
    res.json({
      success: true,
      pandal
    });
  } catch (error) {
    console.error('Error getting pandal by ID:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving pandal' });
  }
};

// Create a new Pandal with uploaded media
export const createPandal = async (req, res) => {
  try {
    const files = req.files || {};
    const cardFile = files.cardImage ? files.cardImage[0] : null;
    const exteriorFile = files.exterior360 ? files.exterior360[0] : (files.panorama ? files.panorama[0] : null);
    const interiorFile = files.interior360 ? files.interior360[0] : null;

    const id = `pandal-${Date.now()}`;
    const name = req.body.name || 'New Durga Puja Pandal';
    const location = req.body.location || 'Kolkata';
    const locationTag = req.body.locationTag || (location.toUpperCase().includes('SALT') ? 'SALT LAKE' : 'KOLKATA');
    const rating = parseFloat(req.body.rating) || 4.8;
    const description = req.body.description || `${name} - 360° Virtual Tour & 3D VR Pandal Experience.`;
    const status = req.body.status || 'active';
    const isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
    const isNew = req.body.isNew === 'true' || req.body.isNew === true;
    const accessType = req.body.accessType || 'free';
    const displayOrder = parseInt(req.body.displayOrder) || 1;
    const mapUrl = req.body.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(location)}`;

    const cardImagePath = cardFile ? `/uploads/${cardFile.filename}` : '/images/pandel/p2.png';
    const exteriorImagePath = exteriorFile ? `/uploads/${exteriorFile.filename}` : '/assets/saltlake-exterior-360.png';
    const interiorImagePath = interiorFile ? `/uploads/${interiorFile.filename}` : '/assets/saltlake-interior-360.png';

    const newPandal = new Pandal({
      id,
      name,
      location,
      locationTag,
      image: cardImagePath,
      rating,
      status,
      isFeatured,
      isNew,
      accessType,
      displayOrder,
      mapUrl,
      features: ['360° View', 'Day & Night', '3D Map'],
      description,
      scenes: {
        exterior: {
          title: `${name} · Exterior Approach`,
          subtitle: `${locationTag} · 360° Interactive View`,
          category: 'exterior',
          image: exteriorImagePath,
          portalTitle: 'Enter Pandal',
          portalNote: 'Continue to the Durga Pratima',
          portalIcon: 'fa-arrow-down',
          portalPosition: { x: 0, y: -2.2, z: -14 },
          nextSceneId: 'interior',
          hotspots: [
            {
              id: `hs-ext-${Date.now()}`,
              position: { x: 0, y: 1.5, z: -12 },
              title: 'Pandal Approach Gate',
              icon: 'fa-archway',
              desc: `Entrance gate of ${name}.`
            }
          ],
          waypoints: [
            { id: 'entrance', name: 'Courtyard Approach', pos: { x: 0, y: -4.2, z: 8 }, target: { x: 0, y: 0, z: -14 } }
          ]
        },
        interior: {
          title: `${name} · Main Sanctum`,
          subtitle: `${name} · Durga Pratima Darshan`,
          category: 'interior',
          image: interiorImagePath,
          portalTitle: 'Return Outside',
          portalNote: 'Back to exterior approach',
          portalIcon: 'fa-arrow-left',
          portalPosition: { x: 0, y: -1.8, z: 14 },
          nextSceneId: 'exterior',
          hotspots: [
            {
              id: `hs-int-${Date.now()}`,
              position: { x: 0, y: 1.2, z: -14 },
              title: 'Maa Durga Pratima',
              icon: 'fa-om',
              desc: `Sacred Durga Idol altar at ${name}.`
            }
          ],
          waypoints: [
            { id: 'sanctum', name: 'Sacred Pratima Altar', pos: { x: 0, y: -4.2, z: -7 }, target: { x: 0, y: 1, z: -14 } }
          ]
        }
      }
    });

    await newPandal.save();

    res.status(201).json({
      success: true,
      message: 'Pandal created and saved to database successfully!',
      pandal: newPandal
    });
  } catch (error) {
    console.error('Error creating pandal:', error);
    res.status(500).json({ success: false, message: 'Server error creating pandal' });
  }
};

// Update media content or metadata for an existing Pandal
export const updatePandalMedia = async (req, res) => {
  try {
    const pandal = await Pandal.findOne({ id: req.params.id });
    if (!pandal) {
      return res.status(404).json({ success: false, message: 'Pandal not found' });
    }

    const files = req.files || {};
    const cardFile = files.cardImage ? files.cardImage[0] : null;
    const exteriorFile = files.exterior360 ? files.exterior360[0] : null;
    const interiorFile = files.interior360 ? files.interior360[0] : null;

    if (req.body.name !== undefined) pandal.name = req.body.name;
    if (req.body.location !== undefined) pandal.location = req.body.location;
    if (req.body.locationTag !== undefined) pandal.locationTag = req.body.locationTag;
    if (req.body.description !== undefined) pandal.description = req.body.description;
    if (req.body.rating !== undefined) pandal.rating = parseFloat(req.body.rating) || 4.8;
    if (req.body.status !== undefined) pandal.status = req.body.status;
    if (req.body.isFeatured !== undefined) pandal.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
    if (req.body.isNew !== undefined) pandal.isNew = req.body.isNew === 'true' || req.body.isNew === true;
    if (req.body.accessType !== undefined) pandal.accessType = req.body.accessType;
    if (req.body.displayOrder !== undefined) pandal.displayOrder = parseInt(req.body.displayOrder) || 1;
    if (req.body.mapUrl !== undefined) pandal.mapUrl = req.body.mapUrl;

    if (cardFile) pandal.image = `/uploads/${cardFile.filename}`;
    if (exteriorFile && pandal.scenes?.exterior) pandal.scenes.exterior.image = `/uploads/${exteriorFile.filename}`;
    if (interiorFile && pandal.scenes?.interior) pandal.scenes.interior.image = `/uploads/${interiorFile.filename}`;

    await pandal.save();

    res.json({
      success: true,
      message: 'Pandal content updated in database successfully!',
      pandal
    });
  } catch (error) {
    console.error('Error updating pandal:', error);
    res.status(500).json({ success: false, message: 'Server error updating pandal' });
  }
};

// Delete a Pandal
export const deletePandal = async (req, res) => {
  try {
    const deleted = await Pandal.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Pandal not found' });
    }
    res.json({
      success: true,
      message: 'Pandal removed from database successfully',
      pandal: deleted
    });
  } catch (error) {
    console.error('Error deleting pandal:', error);
    res.status(500).json({ success: false, message: 'Server error deleting pandal' });
  }
};

// Backward compatible endpoint for viewing modes
export const getViewModes = (req, res) => {
  res.json({
    success: true,
    viewModes: [
      {
        id: '360',
        name: 'Standard 360° Interactive View',
        description: 'Interactive mouse drag, tilt, pan & scroll-zoom equirectangular panorama projection.',
        icon: 'fa-globe'
      },
      {
        id: 'anaglyph',
        name: '3D Anaglyph View (Red / Cyan)',
        description: 'Stereoscopic Dubois red/cyan channel matrix shader rendering for 3D glasses.',
        icon: 'fa-glasses'
      },
      {
        id: 'vr',
        name: 'VR View (Dual Viewport Stereoscopic)',
        description: 'Split screen left/right eye parallel perspective for Google Cardboard and VR headsets.',
        icon: 'fa-vr-cardboard'
      }
    ]
  });
};
