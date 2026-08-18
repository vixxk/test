import mongoose from 'mongoose';

const hotspotSchema = new mongoose.Schema({
  id: String,
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  },
  title: String,
  icon: String,
  desc: String
}, { _id: false });

const waypointSchema = new mongoose.Schema({
  id: String,
  name: String,
  pos: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  },
  target: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  }
}, { _id: false });

const sceneDetailSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  category: String,
  image: String,
  portalTitle: String,
  portalNote: String,
  portalIcon: String,
  portalPosition: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  },
  nextSceneId: String,
  hotspots: [hotspotSchema],
  waypoints: [waypointSchema]
}, { _id: false });

const pandalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  locationTag: { type: String, default: 'KOLKATA' },
  image: { type: String, default: '/images/pandel/p2.png' },
  rating: { type: Number, default: 4.8 },
  status: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active' },
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  accessType: { type: String, enum: ['free', 'premium'], default: 'free' },
  displayOrder: { type: Number, default: 1 },
  mapUrl: { type: String, default: '' },
  features: { type: [String], default: ['360° View', 'Day & Night', '3D Map'] },
  description: { type: String, default: '' },
  scenes: {
    exterior: sceneDetailSchema,
    interior: sceneDetailSchema
  }
}, { timestamps: true });

const Pandal = mongoose.model('Pandal', pandalSchema);

export default Pandal;
