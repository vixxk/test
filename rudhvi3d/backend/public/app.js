class StereoEffect {
            constructor(renderer) {
                this.renderer = renderer;
                this.eyeSeparation = 0.028; // Tightly tuned IPD for monoscopic 360 convergence
                this._cameraL = new THREE.PerspectiveCamera();
                this._cameraR = new THREE.PerspectiveCamera();
                this.width = window.innerWidth;
                this.height = window.innerHeight;
            }
            setSize(width, height) {
                this.width = width || window.innerWidth;
                this.height = height || window.innerHeight;
            }
            render(scene, camera) {
                if (!scene || !camera) return;
                scene.updateMatrixWorld();
                if (camera.parent === null) camera.updateMatrixWorld();

                const aspect = (this.width / 2) / this.height;

                this._cameraL.fov = camera.fov;
                this._cameraL.aspect = aspect;
                this._cameraL.near = camera.near;
                this._cameraL.far = camera.far;
                this._cameraL.updateProjectionMatrix();

                this._cameraR.fov = camera.fov;
                this._cameraR.aspect = aspect;
                this._cameraR.near = camera.near;
                this._cameraR.far = camera.far;
                this._cameraR.updateProjectionMatrix();

                // Parallel stereo cameras: preserve the main camera quaternion and
                // apply only a fixed local-X eye offset. This prevents channel drift.
                camera.matrixWorld.decompose(this._cameraL.position, this._cameraL.quaternion, this._cameraL.scale);
                camera.matrixWorld.decompose(this._cameraR.position, this._cameraR.quaternion, this._cameraR.scale);
                this._cameraL.translateX(-this.eyeSeparation / 2);
                this._cameraR.translateX(this.eyeSeparation / 2);
                this._cameraL.updateMatrixWorld(true);
                this._cameraR.updateMatrixWorld(true);

                const currentRenderTarget = this.renderer.getRenderTarget();
                this.renderer.setRenderTarget(null);
                this.renderer.clear();

                this.renderer.setScissorTest(true);

                const halfWidth = Math.floor(this.width / 2);

                // Left Eye Viewport
                this.renderer.setViewport(0, 0, halfWidth, this.height);
                this.renderer.setScissor(0, 0, halfWidth, this.height);
                this.renderer.render(scene, this._cameraL);

                // Right Eye Viewport
                this.renderer.setViewport(halfWidth, 0, this.width - halfWidth, this.height);
                this.renderer.setScissor(halfWidth, 0, this.width - halfWidth, this.height);
                this.renderer.render(scene, this._cameraR);

                // Reset viewport state
                this.renderer.setScissorTest(false);
                this.renderer.setViewport(0, 0, this.width, this.height);
                if (currentRenderTarget) this.renderer.setRenderTarget(currentRenderTarget);
            }
        }

        class AnaglyphEffect {
            constructor(renderer, width = window.innerWidth, height = window.innerHeight) {
                this.renderer = renderer;
                this.eyeSeparation = 0.022; // Precision IPD for clean Red/Cyan 3D alignment

                this._cameraL = new THREE.PerspectiveCamera();
                this._cameraR = new THREE.PerspectiveCamera();

                const _params = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };

                this._renderTargetL = new THREE.WebGLRenderTarget(width, height, _params);
                this._renderTargetR = new THREE.WebGLRenderTarget(width, height, _params);

                const _material = new THREE.ShaderMaterial({
                    uniforms: {
                        'mapLeft': { value: this._renderTargetL.texture },
                        'mapRight': { value: this._renderTargetR.texture }
                    },
                    vertexShader: `
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                        }
                    `,
                    fragmentShader: `
                        uniform sampler2D mapLeft;
                        uniform sampler2D mapRight;
                        varying vec2 vUv;
                        
                        // Tuned Dubois Anaglyph matrix for clean Red/Cyan overlay
                        mat3 colorMatrixLeft = mat3(
                            0.456100, -0.040016, -0.015216,
                            0.500484, -0.037821, -0.020597,
                            0.176381, -0.015759, -0.005468
                        );
                        mat3 colorMatrixRight = mat3(
                            -0.043470, 0.378476, -0.072152,
                            -0.087938, 0.733640, -0.112961,
                            -0.001555, -0.018450, 1.226408
                        );

                        void main() {
                            vec4 colorL = texture2D( mapLeft, vUv );
                            vec4 colorR = texture2D( mapRight, vUv );
                            vec3 color = colorMatrixLeft * colorL.rgb + colorMatrixRight * colorR.rgb;
                            gl_FragColor = vec4( color, max( colorL.a, colorR.a ) );
                        }
                    `
                });

                const _scene = new THREE.Scene();
                const _camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
                const _mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), _material);
                _scene.add(_mesh);

                this.render = function(scene, camera) {
                    if (!scene || !camera) return;
                    scene.updateMatrixWorld();
                    if (camera.parent === null) camera.updateMatrixWorld();

                    this._cameraL.fov = camera.fov;
                    this._cameraL.aspect = camera.aspect;
                    this._cameraL.near = camera.near;
                    this._cameraL.far = camera.far;
                    this._cameraL.updateProjectionMatrix();

                    this._cameraR.fov = camera.fov;
                    this._cameraR.aspect = camera.aspect;
                    this._cameraR.near = camera.near;
                    this._cameraR.far = camera.far;
                    this._cameraR.updateProjectionMatrix();

                    // Fixed parallel camera pair. Avoid per-frame toe-in/lookAt,
                    // which previously caused red/cyan channels to swim while moving.
                    camera.matrixWorld.decompose(this._cameraL.position, this._cameraL.quaternion, this._cameraL.scale);
                    camera.matrixWorld.decompose(this._cameraR.position, this._cameraR.quaternion, this._cameraR.scale);
                    this._cameraL.translateX(-this.eyeSeparation / 2);
                    this._cameraR.translateX(this.eyeSeparation / 2);
                    this._cameraL.updateMatrixWorld(true);
                    this._cameraR.updateMatrixWorld(true);

                    const currentRenderTarget = this.renderer.getRenderTarget();

                    this.renderer.setRenderTarget(this._renderTargetL);
                    this.renderer.clear();
                    this.renderer.render(scene, this._cameraL);

                    this.renderer.setRenderTarget(this._renderTargetR);
                    this.renderer.clear();
                    this.renderer.render(scene, this._cameraR);

                    this.renderer.setRenderTarget(currentRenderTarget);
                    this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
                    this.renderer.render(_scene, _camera);
                };

                this.setSize = function(width, height) {
                    this._renderTargetL.setSize(width, height);
                    this._renderTargetR.setSize(width, height);
                };
            }
        }

        let scene, camera, renderer, controls;
        let stereoEffect, anaglyphEffect;
        let renderMode = 'normal'; // 'normal', 'vr', 'anaglyph'
        let mainPandalGroup, lightGroup, interactiveHotspotsGroup, particleGroup, walkNodesGroup, floorAdGroup;
        let activePandal = 'saltlake';
        let isAudioPlaying = false;
        let dhaakInterval = null;
        let isAutoRotating = false;
        let showWalkWaypoints = true;
        let sphereMesh;
        let currentTourScene = 'exterior';
        let panoramaLoadToken = 0;

        const tourScenes = {
            exterior: {
                image: 'assets/saltlake-exterior-360.png',
                title: 'Salt Lake Puja · Exterior',
                subtitle: 'Main approach · Select the entrance arrow to go inside',
                portalTitle: 'Enter Puja Pandal',
                portalNote: 'Continue to the Durga Pratima',
                portalIcon: 'fa-arrow-down',
                portalPosition: new THREE.Vector3(0, -2.2, -14),
                next: 'interior'
            },
            interior: {
                image: 'assets/saltlake-interior-360.png',
                title: 'Salt Lake Grand Palace · Interior',
                subtitle: 'Durga Pratima Hall · 360° immersive darshan',
                portalTitle: 'Return Outside',
                portalNote: 'Back to the exterior courtyard',
                portalIcon: 'fa-arrow-left',
                portalPosition: new THREE.Vector3(0, -1.8, 14),
                next: 'exterior'
            }
        };

        // Camera Animation Variables for Little Planet & Top Fly-In
        let isAnimatingCamera = false;
        let camAnimStartPos = new THREE.Vector3();
        let camAnimEndPos = new THREE.Vector3();
        let camAnimStartTarget = new THREE.Vector3();
        let camAnimEndTarget = new THREE.Vector3();
        let camAnimStartFov = 75;
        let camAnimEndFov = 75;
        let camAnimProgress = 0;
        let camAnimDuration = 2200;
        let camAnimStartTime = 0;

        function init3DScene() {
            const container = document.getElementById('canvas-container');
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(135, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 32, 0.1); // Initial Little Planet aerial perspective high in top sky

            renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.25;
            container.appendChild(renderer.domElement);

            // Instantiate Stereo and Anaglyph Effects
            stereoEffect = new StereoEffect(renderer);
            stereoEffect.setSize(window.innerWidth, window.innerHeight);

            anaglyphEffect = new AnaglyphEffect(renderer, window.innerWidth, window.innerHeight);

            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.rotateSpeed = -0.45; // Smooth interior viewing
            controls.enableZoom = true;
            controls.minDistance = 0.1;
            controls.maxDistance = 25;
            controls.target.set(0, -10, -14);
            controls.update();

            mainPandalGroup = new THREE.Group();
            lightGroup = new THREE.Group();
            interactiveHotspotsGroup = new THREE.Group();
            walkNodesGroup = new THREE.Group();
            particleGroup = new THREE.Group();
            floorAdGroup = new THREE.Group();

            scene.add(mainPandalGroup);
            scene.add(lightGroup);
            scene.add(interactiveHotspotsGroup);
            scene.add(walkNodesGroup);
            scene.add(particleGroup);
            scene.add(floorAdGroup);

            buildPandalStructure();
            setupPandalLighting();
            createFloorSponsorBanners();
            createHotspots();
            createWalkWaypoints();
            initPetalCanvas();

            window.addEventListener('resize', onWindowResize);
        }

        function createFloorSponsorBanners() {
            while (floorAdGroup.children.length > 0) {
                floorAdGroup.remove(floorAdGroup.children[0]);
            }
            // Floor ad mats removed for clean 360 view
        }

        function setupPandalLighting() {
            while (lightGroup.children.length > 0) {
                lightGroup.remove(lightGroup.children[0]);
            }
            const theme = pandalThemes[activePandal] || pandalThemes.saltlake;
            const ambientLight = new THREE.AmbientLight(theme.ambientColor, theme.lightIntensity);
            lightGroup.add(ambientLight);

            const mainLight = new THREE.PointLight(0xffdfa0, 2, 25);
            mainLight.position.set(0, 5, -5);
            lightGroup.add(mainLight);

            const idolGlow = new THREE.PointLight(0xffa500, 3, 15);
            idolGlow.position.set(0, 1, -13);
            lightGroup.add(idolGlow);
        }

        function createHotspots() {
            const container = document.getElementById('hotspots-container');
            if (container) container.innerHTML = '';
            if (activePandal === 'saltlake') createScenePortal();
        }

        function createScenePortal() {
            const sceneData = tourScenes[currentTourScene];
            const container = document.getElementById('hotspots-container');
            if (!container) return;
            const portal = document.createElement('button');
            portal.type = 'button';
            portal.id = 'scene-portal';
            portal.className = 'scene-portal';
            portal.setAttribute('aria-label', sceneData.portalTitle);
            portal.innerHTML = `<span class="scene-portal-inner"><span class="scene-portal-arrow"><i class="fa-solid ${sceneData.portalIcon}"></i></span><span class="scene-portal-label">${sceneData.portalTitle}</span><small>${sceneData.portalNote}</small></span>`;
            portal.addEventListener('click', event => {
                event.stopPropagation();
                loadTourScene(sceneData.next, true);
            });
            container.appendChild(portal);
        }

        function createWalkWaypoints() {
            // Walk markers removed for clean 360 view
        }

        function updateOverlayPositions() {
            if (!camera) return;

            // In VR stereo mode, hide screen overlay hotspots to avoid duplication in headset
            if (renderMode === 'vr') {
                const portal = document.getElementById('scene-portal');
                if (portal) portal.style.display = 'none';
                hotspotsData.forEach(hs => {
                    const el = document.getElementById(`hs-${hs.id}`);
                    if (el) el.style.display = 'none';
                });
                walkWaypoints.forEach(wp => {
                    const el = document.getElementById(`wp-${wp.id}`);
                    if (el) el.style.display = 'none';
                });
                return;
            }

            hotspotsData.forEach(hs => {
                const el = document.getElementById(`hs-${hs.id}`);
                if (!el) return;
                const tempV = hs.position.clone();
                tempV.project(camera);

                if (tempV.z < 1) {
                    const x = (tempV.x * .5 + .5) * window.innerWidth;
                    const y = (-(tempV.y * .5) + .5) * window.innerHeight;
                    el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
                    el.style.display = 'block';
                } else {
                    el.style.display = 'none';
                }
            });

            const portal = document.getElementById('scene-portal');
            if (portal && activePandal === 'saltlake') {
                const tempV = tourScenes[currentTourScene].portalPosition.clone();
                tempV.project(camera);
                if (tempV.z < 1) {
                    const x = (tempV.x * .5 + .5) * window.innerWidth;
                    const y = (-(tempV.y * .5) + .5) * window.innerHeight;
                    portal.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
                    portal.style.display = 'block';
                } else {
                    portal.style.display = 'none';
                }
            }

            walkWaypoints.forEach(wp => {
                const el = document.getElementById(`wp-${wp.id}`);
                if (!el) return;
                if (!showWalkWaypoints) {
                    el.style.display = 'none';
                    return;
                }
                const tempV = wp.pos.clone();
                tempV.project(camera);

                if (tempV.z < 1) {
                    const x = (tempV.x * .5 + .5) * window.innerWidth;
                    const y = (-(tempV.y * .5) + .5) * window.innerHeight;
                    el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
                    el.style.display = 'block';
                } else {
                    el.style.display = 'none';
                }
            });
        }

        function smoothMoveCamera(endPos, endTarget, duration = 1600, targetFov = 75) {
            if (!camera || !controls) return;
            camAnimStartPos.copy(camera.position);
            camAnimEndPos.copy(endPos);
            camAnimStartTarget.copy(controls.target);
            camAnimEndTarget.copy(endTarget);
            camAnimStartFov = camera.fov;
            camAnimEndFov = targetFov;
            camAnimDuration = duration;
            camAnimStartTime = performance.now();
            isAnimatingCamera = true;
        }

        function triggerLittlePlanetTransition() {
            if (!camera || !controls) return;
            showToast("🌍 Transitioning to Little Planet Top Aerial View...", "fa-globe");
            
            smoothMoveCamera(new THREE.Vector3(0, 28, 0.1), new THREE.Vector3(0, -10, -14), 1800, 135);

            setTimeout(() => {
                smoothMoveCamera(new THREE.Vector3(0, 0, 0.1), new THREE.Vector3(0, 0, -14), 2200, 75);
                showToast("Entering 360° Pandal Walkthrough", "fa-person-walking");
            }, 2600);
        }

        function setRenderMode(mode) {
            renderMode = mode;

            document.getElementById('mode-normal-btn').classList.remove('active-mode');
            document.getElementById('mode-vr-btn').classList.remove('active-mode');
            document.getElementById('mode-anaglyph-btn').classList.remove('active-mode');

            const banner = document.getElementById('active-mode-banner');
            const divider = document.getElementById('vr-divider-line');

            if (mode === 'normal') {
                document.getElementById('mode-normal-btn').classList.add('active-mode');
                banner.classList.add('hidden');
                divider.classList.add('hidden');
                renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
                showToast("Switched to Standard 360° Interactive Mode", "fa-globe");
            } else if (mode === 'vr') {
                // Disable auto-rotation in VR mode for stable head tracking
                isAutoRotating = false;
                if (controls) controls.autoRotate = false;

                document.getElementById('mode-vr-btn').classList.add('active-mode');
                document.getElementById('mode-banner-icon').innerText = '🥽';
                document.getElementById('mode-banner-text').innerText = 'VR Stereoscopic Mode Active — Move head / mouse to look around';
                banner.classList.remove('hidden');
                divider.classList.remove('hidden');
                stereoEffect.setSize(window.innerWidth, window.innerHeight);

                // Request gyro orientation on mobile if available
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    DeviceOrientationEvent.requestPermission().catch(() => {});
                }

                showToast("🥽 VR Stereoscopic Split Screen Active!", "fa-vr-cardboard");
            } else if (mode === 'anaglyph') {
                document.getElementById('mode-anaglyph-btn').classList.add('active-mode');
                document.getElementById('mode-banner-icon').innerText = '🕶️';
                document.getElementById('mode-banner-text').innerText = '3D Anaglyph Mode Active — Put on Red/Cyan Glasses';
                banner.classList.remove('hidden');
                divider.classList.add('hidden');
                renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
                anaglyphEffect.setSize(window.innerWidth, window.innerHeight);
                showToast("🕶️ Red-Cyan Anaglyph 3D Mode Active!", "fa-glasses");
            }
        }

        function teleportToWaypoint(wp) {
            showToast(`Walking to ${wp.name}...`, "fa-shoe-prints");
            smoothMoveCamera(wp.pos, wp.target, 1400, 75);

            document.querySelectorAll('.view-node-btn').forEach(btn => {
                if (btn.getAttribute('data-view') === wp.id) {
                    btn.className = 'view-node-btn active-view px-3 py-2 rounded-xl text-xs font-medium text-yellow-200 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/40 transition flex items-center gap-1.5 whitespace-nowrap';
                } else {
                    btn.className = 'view-node-btn px-3 py-2 rounded-xl text-xs font-medium text-yellow-200/70 hover:bg-amber-500/20 hover:text-yellow-200 border border-transparent transition flex items-center gap-1.5 whitespace-nowrap';
                }
            });
        }

        const pandalThemes = {
            saltlake: {
                name: "Salt Lake Grand Palace",
                location: "Salt Lake Block FD Sarbojanin • Kolkata",
                ambientColor: 0xffeaaf,
                lightIntensity: 1.5,
                details: "Magnificent marble palace hall featuring ornate golden chandeliers, decorative archways, sitar displays, Tanishq & Novesta floor mats, and royal blue ceiling dome."
            },
            dumdum: {
                name: "Dumdum Park Cultural",
                location: "Dumdum Tarun Sangha • Kolkata",
                ambientColor: 0xffc480,
                lightIntensity: 1.3,
                details: "Rich Bengal artisanal terracotta sculptures, dark carved wood ceiling motifs, white circular Alpona floor art, Tanishq & Novesta sponsor mats, and grand Pratima sanctum."
            }
        };

        const hotspotsData = [
            { id: 'idol', position: new THREE.Vector3(0, 1.2, -14), title: "Maa Durga Pratima", icon: "fa-om", desc: "Ten-armed Goddess Durga slaying Mahishasura, flanked by Lakshmi, Saraswati, Ganesha & Kartikeya in ornate golden halo background." },
            { id: 'tanishq', position: new THREE.Vector3(0, -3.2, 5), title: "Tanishq Floor Banner", icon: "fa-gem", desc: "Tanishq Official Jewellery Partner floor banner presenting exquisite festive Durga Puja collections." },
            { id: 'novesta', position: new THREE.Vector3(-5, -3.2, -2), title: "Novesta Group Floor Banner", icon: "fa-building", desc: "Novesta Group Infrastructure & Real Estate Partner floor banner celebrating modern urban spaces in Kolkata." },
            { id: 'alpona', position: new THREE.Vector3(0, -4.5, -4), title: "Sacred Alpona Motif", icon: "fa-palette", desc: "Intricate floor art rendered with traditional rice paste motifs signaling welcoming of prosperity and auspicious blessings." },
            { id: 'dhaak', position: new THREE.Vector3(5.5, -2, -9), title: "Dhaak & Musical Display", icon: "fa-drum", desc: "Traditional Bengali percussion instrument and classical sitar played during Puja rituals and rhythmic Dhunuchi dance." }
        ];

        const walkWaypoints = [
            { id: 'entrance', name: "Entrance Archway (Tanishq)", pos: new THREE.Vector3(0, -4.2, 8), target: new THREE.Vector3(0, 0, -14) },
            { id: 'courtyard', name: "Pandal Courtyard (Novesta)", pos: new THREE.Vector3(-3, -4.2, 2), target: new THREE.Vector3(0, 0, -14) },
            { id: 'sanctum', name: "Sacred Pratima Altar", pos: new THREE.Vector3(0, -4.2, -7), target: new THREE.Vector3(0, 1, -14) },
            { id: 'dhunuchi', name: "Dhunuchi Dance Stage", pos: new THREE.Vector3(4.5, -4.2, -5), target: new THREE.Vector3(0, 0, -14) }
        ];

        function generateSaltLake360Panorama() {
            const canvas = document.createElement('canvas');
            canvas.width = 2048;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');

            const skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
            skyGrad.addColorStop(0, '#0a142c');
            skyGrad.addColorStop(0.4, '#1b2a52');
            skyGrad.addColorStop(0.8, '#422817');
            skyGrad.addColorStop(1, '#664327');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, 2048, 512);

            ctx.strokeStyle = 'rgba(235, 190, 70, 0.45)';
            ctx.lineWidth = 3;
            for (let r = 40; r < 480; r += 40) {
                ctx.beginPath();
                ctx.arc(1024, 180, r, 0, Math.PI * 2);
                ctx.stroke();
            }

            const chanX = [600, 1024, 1448];
            chanX.forEach(x => {
                const cGlow = ctx.createRadialGradient(x, 220, 5, x, 220, 95);
                cGlow.addColorStop(0, '#ffffff');
                cGlow.addColorStop(0.3, '#ffea7a');
                cGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
                ctx.fillStyle = cGlow;
                ctx.beginPath();
                ctx.arc(x, 220, 95, 0, Math.PI * 2);
                ctx.fill();
            });

            const wallGrad = ctx.createLinearGradient(0, 480, 0, 850);
            wallGrad.addColorStop(0, '#593b28');
            wallGrad.addColorStop(0.5, '#7c543a');
            wallGrad.addColorStop(1, '#3b2518');
            ctx.fillStyle = wallGrad;
            ctx.fillRect(0, 480, 2048, 370);

            ctx.fillStyle = '#edd3b9';
            for (let x = 80; x < 2048; x += 280) {
                ctx.fillRect(x, 420, 55, 420);
                ctx.fillStyle = '#d4af37';
                ctx.fillRect(x - 8, 410, 71, 15);
                ctx.fillStyle = '#edd3b9';
            }

            const sanctumGlow = ctx.createRadialGradient(1024, 600, 10, 1024, 600, 320);
            sanctumGlow.addColorStop(0, '#ffffff');
            sanctumGlow.addColorStop(0.2, '#ffd700');
            sanctumGlow.addColorStop(0.6, '#cc3300');
            sanctumGlow.addColorStop(1, 'rgba(100, 0, 0, 0)');
            ctx.fillStyle = sanctumGlow;
            ctx.beginPath();
            ctx.arc(1024, 600, 320, 0, Math.PI * 2);
            ctx.fill();

            const floorGrad = ctx.createLinearGradient(0, 850, 0, 1024);
            floorGrad.addColorStop(0, '#e8ded1');
            floorGrad.addColorStop(0.5, '#cebeaa');
            floorGrad.addColorStop(1, '#4a3222');
            ctx.fillStyle = floorGrad;
            ctx.fillRect(0, 850, 2048, 174);

            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            return texture;
        }

        function generateDumdum360Panorama() {
            const canvas = document.createElement('canvas');
            canvas.width = 2048;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');

            const skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
            skyGrad.addColorStop(0, '#1c0a03');
            skyGrad.addColorStop(0.5, '#451a08');
            skyGrad.addColorStop(1, '#692a0f');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, 2048, 512);

            ctx.strokeStyle = '#2b1004';
            ctx.lineWidth = 8;
            for (let x = 0; x <= 2048; x += 64) {
                ctx.beginPath();
                ctx.moveTo(x, 0); ctx.lineTo(x, 512);
                ctx.stroke();
            }

            const wallGrad = ctx.createLinearGradient(0, 512, 0, 840);
            wallGrad.addColorStop(0, '#541f0a');
            wallGrad.addColorStop(0.5, '#782f12');
            wallGrad.addColorStop(1, '#3b1406');
            ctx.fillStyle = wallGrad;
            ctx.fillRect(0, 512, 2048, 328);

            const floorGrad = ctx.createLinearGradient(0, 840, 0, 1024);
            floorGrad.addColorStop(0, '#664532');
            floorGrad.addColorStop(1, '#2b1a11');
            ctx.fillStyle = floorGrad;
            ctx.fillRect(0, 840, 2048, 184);

            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            return texture;
        }

        function applyPanoramaTexture(panoTexture) {
            while (mainPandalGroup.children.length > 0) {
                const child = mainPandalGroup.children[0];
                mainPandalGroup.remove(child);
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (child.material.map && child.material.map !== panoTexture) child.material.map.dispose();
                    child.material.dispose();
                }
            }
            panoTexture.encoding = THREE.sRGBEncoding;
            panoTexture.minFilter = THREE.LinearFilter;
            panoTexture.magFilter = THREE.LinearFilter;
            panoTexture.generateMipmaps = true;
            panoTexture.needsUpdate = true;

            const sphereGeo = new THREE.SphereGeometry(30, 72, 48);
            sphereGeo.scale(-1, 1, 1);
            sphereMesh = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({ map: panoTexture }));
            mainPandalGroup.add(sphereMesh);
        }

        function updateTourSceneUI() {
            if (activePandal !== 'saltlake') {
                document.body.classList.remove('outside-mode');
                return;
            }
            const sceneData = tourScenes[currentTourScene];
            document.getElementById('active-pandal-title').innerText = sceneData.title;
            document.getElementById('active-pandal-sub').innerHTML = `<span class="scene-chip">${sceneData.subtitle}</span>`;
            document.body.classList.toggle('outside-mode', currentTourScene === 'exterior');
            if (floorAdGroup) floorAdGroup.visible = currentTourScene === 'interior';
        }

        function loadTourScene(sceneKey, animated = true) {
            if (!tourScenes[sceneKey]) return;
            const token = ++panoramaLoadToken;
            const transition = document.getElementById('scene-transition');
            const sceneData = tourScenes[sceneKey];
            document.getElementById('scene-transition-title').innerText = sceneKey === 'interior' ? 'Entering the Puja Pandal' : 'Returning to the Exterior';
            if (animated) transition.classList.add('active');

            new THREE.TextureLoader().load(sceneData.image, texture => {
                if (token !== panoramaLoadToken) { texture.dispose(); return; }
                currentTourScene = sceneKey;
                applyPanoramaTexture(texture);
                camera.position.set(0, 0, 0.1);
                controls.target.set(0, currentTourScene === 'exterior' ? -1 : 0, -14);
                camera.fov = 75;
                camera.updateProjectionMatrix();
                controls.update();
                createHotspots();
                createWalkWaypoints();
                updateTourSceneUI();
                setupPandalLighting();
                setTimeout(() => transition.classList.remove('active'), animated ? 650 : 0);
                if (animated) showToast(currentTourScene === 'interior' ? 'Welcome inside · Durga Pratima Hall' : 'Returned to the Salt Lake exterior', currentTourScene === 'interior' ? 'fa-hands-praying' : 'fa-gopuram');
            }, undefined, () => {
                transition.classList.remove('active');
                showToast('Could not load the 360° panorama', 'fa-triangle-exclamation');
            });
        }

        function buildPandalStructure(customTexture = null) {
            if (customTexture) {
                applyPanoramaTexture(customTexture);
            } else {
                // Load the real uploaded panorama directly. Do not display the
                // old generated placeholder scene while the image is loading.
                activePandal = 'saltlake';
                loadTourScene(currentTourScene, false);
            }
        }

        function switchPandalTheme(themeKey) {
            if (!pandalThemes[themeKey]) return;
            activePandal = themeKey;

            const theme = pandalThemes[themeKey];
            if (themeKey === 'saltlake') {
                currentTourScene = 'exterior';
                loadTourScene('exterior', true);
            } else {
                document.getElementById('active-pandal-title').innerText = theme.name;
                document.getElementById('active-pandal-sub').innerText = theme.location;
                document.body.classList.remove('outside-mode');
                if (floorAdGroup) floorAdGroup.visible = true;
                buildPandalStructure();
                createHotspots();
                createWalkWaypoints();
                setupPandalLighting();
                triggerLittlePlanetTransition();
            }
        }

        function triggerDhaakBeats() {
            const dhaakBtn = document.getElementById('dhaak-btn');
            if (dhaakInterval) {
                clearInterval(dhaakInterval);
                dhaakInterval = null;
                if (dhaakBtn) dhaakBtn.classList.remove('active-dhaak', 'active-mode');
                showToast("Dhaak Beats Stopped", "fa-stop");
                return;
            }
            if (dhaakBtn) dhaakBtn.classList.add('active-dhaak', 'active-mode');
            showToast("🥁 Playing Traditional Dhaak Rhythm!", "fa-drum");
            let beat = 0;
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            dhaakInterval = setInterval(() => {
                if (!audioCtx) return;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                const freq = (beat % 4 === 0) ? 140 : 220;
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
                
                osc.start();
                osc.stop(audioCtx.currentTime + 0.15);
                beat++;
            }, 250);
        }

        function playShankhSound(showNotification = true) {
            if (showNotification) {
                showToast("🐚 Blowing Sacred Shankh Sound!", "fa-bullhorn");
            }
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.connect(gain);
                gain.connect(audioCtx.destination);

                const now = audioCtx.currentTime;
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.linearRampToValueAtTime(460, now + 1.2);
                osc.frequency.linearRampToValueAtTime(380, now + 2.5);

                gain.gain.setValueAtTime(0.01, now);
                gain.gain.linearRampToValueAtTime(0.35, now + 0.5);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);

                osc.start(now);
                osc.stop(now + 2.6);
            } catch (e) {
                console.log("Audio play error", e);
            }
        }




        // Falling Petals Canvas
        let petals = [];
        function initPetalCanvas() {
            const canvas = document.getElementById('petal-canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const ctx = canvas.getContext('2d');

            function renderPetals() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                petals.forEach((p, index) => {
                    p.y += p.speedY;
                    p.x += Math.sin(p.y * 0.02) * p.speedX;
                    p.rotation += 0.02;

                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, p.size, p.size * 1.6, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();

                    if (p.y > canvas.height) petals.splice(index, 1);
                });
                requestAnimationFrame(renderPetals);
            }
            renderPetals();
        }

        function triggerPushpanjaliFlowers() {
            showToast("🌺 Offered Pushpanjali Marigold Flowers to Maa Durga!", "fa-spa");
            const colors = ['#ff4500', '#ffa500', '#ffd700', '#ff69b4'];
            for (let i = 0; i < 40; i++) {
                petals.push({
                    x: Math.random() * window.innerWidth,
                    y: -20,
                    size: 4 + Math.random() * 6,
                    speedY: 2 + Math.random() * 3,
                    speedX: 0.5 + Math.random() * 1.5,
                    rotation: Math.random() * Math.PI,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }
        }

        function showToast(msg, icon = 'fa-sparkles') {
            const toast = document.getElementById('toast');
            document.getElementById('toast-msg').innerText = msg;
            document.getElementById('toast-icon').className = `fa-solid ${icon} text-amber-400`;
            toast.classList.remove('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                toast.classList.add('opacity-0', 'pointer-events-none');
            }, 3000);
        }

        function openHotspotModal(data) {
            document.getElementById('modal-title').innerText = data.title;
            document.getElementById('modal-body').innerText = data.desc;
            document.getElementById('modal-icon').innerHTML = `<i class="fa-solid ${data.icon || 'fa-om'}"></i>`;

            const modal = document.getElementById('info-modal');
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.remove('opacity-0'), 10);
        }

        function captureVirtualSnapshot() {
            if (!renderer) return;
            renderer.render(scene, camera);
            const dataUrl = renderer.domElement.toDataURL("image/jpeg");
            document.getElementById('snapshot-img').src = dataUrl;

            const modal = document.getElementById('snapshot-modal');
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.remove('opacity-0'), 10);
        }

        function onWindowResize() {
            if (!camera || !renderer) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
            stereoEffect.setSize(window.innerWidth, window.innerHeight);
            anaglyphEffect.setSize(window.innerWidth, window.innerHeight);

            const canvas = document.getElementById('petal-canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function animate(now) {
            requestAnimationFrame(animate);

            if (isAnimatingCamera) {
                const elapsed = (now || performance.now()) - camAnimStartTime;
                camAnimProgress = Math.min(elapsed / camAnimDuration, 1);
                
                const ease = 1 - Math.pow(1 - camAnimProgress, 3);

                camera.position.lerpVectors(camAnimStartPos, camAnimEndPos, ease);
                controls.target.lerpVectors(camAnimStartTarget, camAnimEndTarget, ease);
                camera.fov = THREE.MathUtils.lerp(camAnimStartFov, camAnimEndFov, ease);
                camera.updateProjectionMatrix();

                if (camAnimProgress >= 1) {
                    isAnimatingCamera = false;
                }
            }

            controls.update();
            updateOverlayPositions();

            // Render based on active 3D view mode
            if (renderMode === 'vr') {
                stereoEffect.render(scene, camera);
            } else if (renderMode === 'anaglyph') {
                anaglyphEffect.render(scene, camera);
            } else {
                renderer.render(scene, camera);
            }
        }

        function loadPandalFromApi(pandalId) {
            fetch(`/api/pandals/${pandalId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.pandal) {
                        const p = data.pandal;
                        const hasPass = localStorage.getItem('puja3d_pass') === 'true';
                        const isLocked = p.accessType === 'premium' && !hasPass;

                        if (isLocked) {
                            const lockModal = document.getElementById('premium-lock-modal');
                            const lockSub = document.getElementById('lock-modal-subtitle');
                            if (lockSub) {
                                lockSub.innerHTML = `"${p.name}" is a <strong class="text-amber-300">Premium 360° Pandal</strong>. Unlock it and all premium experiences with a Puja3D Pass.`;
                            }
                            if (lockModal) {
                                lockModal.classList.remove('hidden');
                                setTimeout(() => lockModal.classList.add('opacity-100'), 50);
                            }
                        }

                        if (p.scenes && p.scenes.exterior) {
                            tourScenes.exterior.image = p.scenes.exterior.image;
                            tourScenes.exterior.title = p.scenes.exterior.title;
                            tourScenes.exterior.subtitle = p.scenes.exterior.subtitle;
                        }
                        if (p.scenes && p.scenes.interior) {
                            tourScenes.interior.image = p.scenes.interior.image;
                            tourScenes.interior.title = p.scenes.interior.title;
                            tourScenes.interior.subtitle = p.scenes.interior.subtitle;
                        }
                        document.getElementById('active-pandal-title').innerText = p.name;
                        document.getElementById('active-pandal-sub').innerText = `${p.location} • 360° Live Virtual Walkthrough`;
                        loadTourScene(currentTourScene, false);
                    }
                })
                .catch(err => console.log('Loaded default tour dataset', err));
        }

        const unlockBtn = document.getElementById('unlock-pass-btn');
        if (unlockBtn) {
            unlockBtn.addEventListener('click', () => {
                localStorage.setItem('puja3d_pass', 'true');
                const lockModal = document.getElementById('premium-lock-modal');
                if (lockModal) {
                    lockModal.classList.remove('opacity-100');
                    setTimeout(() => lockModal.classList.add('hidden'), 300);
                }
                showToast('🎉 Puja3D Pass Activated! Premium 360° Access Unlocked!');
            });
        }


        window.onload = function () {
            init3DScene();
            animate();

            const urlParams = new URLSearchParams(window.location.search);
            const activePandalParam = urlParams.get('pandal') || 'salt-lake-1';
            loadPandalFromApi(activePandalParam);

            // Standard 360 interactive view entry sequence
            playShankhSound(false);
            document.body.classList.add('curtains-open');

            const header = document.getElementById('main-header');
            if (header) header.classList.remove('opacity-0');

            const controls = document.getElementById('main-controls');
            if (controls) controls.classList.remove('opacity-0');

            const hint = document.getElementById('interaction-hint');
            if (hint) {
                hint.classList.add('visible');
                setTimeout(() => hint.classList.remove('visible'), 6500);
            }

            // 3D Render Mode Buttons
            document.getElementById('mode-normal-btn')?.addEventListener('click', () => setRenderMode('normal'));
            document.getElementById('mode-vr-btn')?.addEventListener('click', () => setRenderMode('vr'));
            document.getElementById('mode-anaglyph-btn')?.addEventListener('click', () => setRenderMode('anaglyph'));
            document.getElementById('little-planet-btn')?.addEventListener('click', triggerLittlePlanetTransition);

            document.getElementById('upload-btn')?.addEventListener('click', () => {
                document.getElementById('custom-360-upload')?.click();
            });

            document.getElementById('custom-360-upload').addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                // Sync with backend API
                const formData = new FormData();
                formData.append('panorama', file);
                formData.append('title', file.name);

                fetch('/api/scenes/upload', {
                    method: 'POST',
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        console.log('Successfully saved to backend:', data.scene);
                    }
                })
                .catch(err => console.error('Backend upload sync error:', err));

                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = new Image();
                    img.onload = function() {
                        const texture = new THREE.Texture(img);
                        texture.needsUpdate = true;
                        buildPandalStructure(texture);
                        document.getElementById('active-pandal-title').innerText = "Custom Uploaded Pandal";
                        document.getElementById('active-pandal-sub').innerText = file.name;
                        triggerLittlePlanetTransition();
                        showToast("Loaded Custom 360 Photo into 3D/VR Viewer!", "fa-circle-check");
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            });

            document.getElementById('dhaak-btn').addEventListener('click', triggerDhaakBeats);
            document.getElementById('shankh-btn').addEventListener('click', playShankhSound);
            document.getElementById('offer-flowers-btn').addEventListener('click', triggerPushpanjaliFlowers);
            
            document.getElementById('light-diya-btn').addEventListener('click', () => {
                showToast("🪔 Sacred Diya Lighted with Prayers!", "fa-fire-flame-curved");
                const light = new THREE.PointLight(0xffaa00, 3.5, 12);
                light.position.set((Math.random() - 0.5) * 6, -3, -6);
                scene.add(light);
            });

            document.getElementById('toggle-walk-markers-btn')?.addEventListener('click', () => {
                showWalkWaypoints = !showWalkWaypoints;
                showToast(showWalkWaypoints ? "Walk Markers Enabled" : "Walk Markers Hidden", "fa-shoe-prints");
            });

            document.getElementById('autorotate-btn').addEventListener('click', () => {
                isAutoRotating = !isAutoRotating;
                controls.autoRotate = isAutoRotating;
                controls.autoRotateSpeed = 2.0;
                showToast(isAutoRotating ? "360° Auto Rotation Enabled" : "Auto Rotation Disabled", "fa-arrows-spin");
            });

            document.getElementById('snapshot-btn').addEventListener('click', captureVirtualSnapshot);

            document.getElementById('close-info-modal').addEventListener('click', () => {
                const modal = document.getElementById('info-modal');
                modal.classList.add('opacity-0');
                setTimeout(() => modal.classList.add('hidden'), 300);
            });

            document.getElementById('info-btn').addEventListener('click', () => {
                openHotspotModal({
                    title: "3D View Modes & Pandal Guide",
                    icon: "fa-glasses",
                    desc: "• 360° Standard Mode: Interactive drag, tilt, pan & zoom.\n• 🥽 VR View Mode: Stereoscopic split-screen for Google Cardboard / VR headsets.\n• 🕶️ 3D Anaglyph Mode: Wear Red/Cyan glasses for true stereoscopic 3D depth.\n• Little Planet View: Click 'Little Planet' at top right for aerial drone descent.\n• Floor Banners: Tanishq at entrance walkway & Novesta Group at courtyard."
                });
            });

            const switchModal = document.getElementById('pandal-switch-modal');
            document.getElementById('switch-pandal-btn').addEventListener('click', () => {
                switchModal.classList.remove('hidden');
                setTimeout(() => switchModal.classList.remove('opacity-0'), 10);
            });

            document.getElementById('close-pandal-modal').addEventListener('click', () => {
                switchModal.classList.add('opacity-0');
                setTimeout(() => switchModal.classList.add('hidden'), 300);
            });

            document.querySelectorAll('.pandal-card').forEach(card => {
                card.addEventListener('click', () => {
                    const themeKey = card.getAttribute('data-pandal');
                    switchPandalTheme(themeKey);
                    switchModal.classList.add('opacity-0');
                    setTimeout(() => switchModal.classList.add('hidden'), 300);
                });
            });

            document.querySelectorAll('.view-node-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const viewKey = btn.getAttribute('data-view');
                    const wp = walkWaypoints.find(w => w.id === viewKey);
                    if (wp) teleportToWaypoint(wp);
                });
            });

            document.getElementById('close-snapshot-modal').addEventListener('click', () => {
                const modal = document.getElementById('snapshot-modal');
                modal.classList.add('opacity-0');
                setTimeout(() => modal.classList.add('hidden'), 300);
            });

            document.getElementById('download-postcard-btn').addEventListener('click', () => {
                const link = document.createElement('a');
                link.download = 'durga-puja-360-souvenir.jpg';
                link.href = document.getElementById('snapshot-img').src;
                link.click();
                showToast("Souvenir Postcard Downloaded!", "fa-circle-check");
            });

            document.getElementById('close-hint').addEventListener('click', () => {
                document.getElementById('interaction-hint').classList.remove('visible');
            });

            const toggleInterface = (hide) => {
                document.body.classList.toggle('ui-hidden', hide);
                document.getElementById('hide-ui-btn').setAttribute('aria-pressed', String(hide));
            };
            document.getElementById('hide-ui-btn').addEventListener('click', () => toggleInterface(true));
            document.getElementById('ui-restore-btn').addEventListener('click', () => toggleInterface(false));

            document.getElementById('fullscreen-btn').addEventListener('click', async () => {
                try {
                    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
                    else await document.exitFullscreen();
                } catch (error) {
                    showToast("Fullscreen is not available in this browser", "fa-circle-info");
                }
            });
            document.addEventListener('fullscreenchange', () => {
                const active = Boolean(document.fullscreenElement);
                document.querySelector('#fullscreen-btn i').className = `fa-solid ${active ? 'fa-compress' : 'fa-expand'}`;
                document.getElementById('fullscreen-btn').title = active ? 'Exit Fullscreen' : 'Enter Fullscreen';
            });

            document.addEventListener('keydown', (event) => {
                if (event.target.matches('input, textarea, select')) return;
                if (event.key === 'Escape') toggleInterface(false);
                if (event.key.toLowerCase() === 'f') document.getElementById('fullscreen-btn').click();
                if (event.key.toLowerCase() === 'h') toggleInterface(!document.body.classList.contains('ui-hidden'));
                if (event.key === '1') setRenderMode('normal');
                if (event.key === '2') setRenderMode('vr');
                if (event.key === '3') setRenderMode('anaglyph');
            });
        };
