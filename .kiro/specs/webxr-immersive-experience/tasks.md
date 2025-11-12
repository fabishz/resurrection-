# Implementation Plan

- [ ] 1. Set up project dependencies and configuration
  - Install Three.js, React Three Fiber, Drei, Zustand, and Zod packages
  - Configure TypeScript to include WebXR type definitions
  - Update Next.js config for static export and WebXR optimization
  - Set up path aliases for clean imports
  - _Requirements: 2.1, 2.2, 7.4_

- [ ] 2. Create core TypeScript types and interfaces
  - Define XR session types and state enums
  - Create interfaces for all manager classes (Session, Scene, Asset, Interaction, Performance)
  - Define data models for SceneObject, Asset, and InputState
  - Create error types and categories
  - Write Zod schemas for state validation
  - _Requirements: 2.1, 2.4_

- [ ] 3. Implement State Manager with Zustand
  - Create Zustand store with AppState interface
  - Implement state update methods with Zod validation
  - Add localStorage persistence and restoration
  - Create React hooks (useXRState, useXRSession, useXRScene)
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 3.1 Write unit tests for State Manager
  - Test state updates and subscriber notifications
  - Test persistence and restoration
  - Test validation with invalid state
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 4. Build XR Session Manager
  - Implement WebXR capability detection (isXRSupported, getSupportedModes)
  - Create session initialization with mode selection (immersive-vr, immersive-ar, inline)
  - Implement session lifecycle methods (startSession, endSession)
  - Add frame callback registration and management
  - Implement error handling with fallback to inline mode
  - Integrate with Three.js WebGLRenderer.xr
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 4.1 Write unit tests for session detection and lifecycle
  - Test capability detection with mocked navigator.xr
  - Test session state transitions
  - Test error handling and fallbacks
  - _Requirements: 1.2, 1.3_

- [ ] 5. Create Scene Manager with Three.js
  - Initialize Three.js Scene with default lighting (ambient + directional)
  - Set up PerspectiveCamera with proper FOV and aspect ratio
  - Implement object registry with UUID-based lookup
  - Create methods to add/remove/get objects from scene
  - Implement scene update loop for animations
  - Add dispose method for cleanup
  - _Requirements: 3.1, 3.4_

- [ ] 6. Implement Asset Loader with caching
  - Set up GLTFLoader with LoadingManager for progress tracking
  - Implement model loading with error handling and retry logic
  - Create texture loading with compression support
  - Build asset cache using Map with URL keys
  - Implement preloadAssets for batch loading with manifest
  - Add fallback asset loading on error
  - Create progress reporting system
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 6.1 Write unit tests for asset loading and caching
  - Test cache hit/miss scenarios
  - Test error handling and fallback loading
  - Test progress calculation
  - _Requirements: 5.2, 5.3, 5.5_

- [ ] 7. Build Interaction Handler for multi-input support
  - Set up Three.js Raycaster for intersection detection
  - Implement gaze tracking with 1.5s timer threshold
  - Add XR controller input handling via XRInputSource
  - Implement mouse and touch event handlers for fallback
  - Create input prioritization logic (controller > gaze > mouse)
  - Build object registration system with interaction callbacks
  - Add visual feedback for hover and selection states
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 7.1 Write unit tests for input prioritization
  - Test input source priority logic
  - Test raycasting and intersection detection
  - Test gaze timer threshold
  - _Requirements: 4.5_

- [ ] 8. Create Performance Monitor with adaptive quality
  - Implement FPS counter with rolling average (60 samples)
  - Track Three.js renderer stats (drawCalls, triangles, textures)
  - Monitor memory usage using performance.memory API
  - Create metrics update event system
  - Implement adaptive quality reduction when FPS < 55
  - Add development mode logging for performance metrics
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 8.1 Write unit tests for performance calculations
  - Test FPS calculation with mock timestamps
  - Test adaptive quality trigger logic
  - Test metrics aggregation
  - _Requirements: 6.2, 6.5_

- [ ] 9. Build React UI components
  - Create EntryScreen component with XR capability detection
  - Build LoadingOverlay with progress bar and percentage
  - Implement ErrorBoundary with user-friendly error messages
  - Create XRCanvas component as Three.js renderer wrapper
  - Add visual feedback components (reticle, highlights)
  - _Requirements: 1.2, 3.2, 10.1, 10.2, 10.3_

- [ ] 10. Implement XRCanvas component with React Three Fiber
  - Set up Canvas component with WebGL renderer configuration
  - Configure XR mode and reference space
  - Integrate Scene Manager with R3F scene graph
  - Connect frame loop to update callbacks
  - Add camera and lighting setup
  - Implement cleanup on unmount
  - _Requirements: 1.1, 3.1, 7.1_

- [ ] 11. Create XR experience page with session flow
  - Build main XR page component at /app/xr/page.tsx
  - Implement "Enter XR" button with session initialization
  - Connect EntryScreen to XR Session Manager
  - Add loading state during scene initialization
  - Implement session exit and cleanup flow
  - Add error handling UI for session failures
  - _Requirements: 1.1, 1.2, 1.5, 3.2, 3.4_

- [ ] 12. Integrate all managers into unified XR system
  - Create XRSystem class that orchestrates all managers
  - Wire Session Manager to Scene Manager lifecycle
  - Connect Asset Loader to Scene Manager for object creation
  - Integrate Interaction Handler with Scene Manager objects
  - Link Performance Monitor to adaptive quality controls
  - Connect State Manager to all components for reactive updates
  - _Requirements: 2.3, 3.5_

- [ ] 13. Add default 3D environment and test scene
  - Create simple test scene with geometric primitives (cube, sphere, plane)
  - Add interactive objects with hover and click handlers
  - Implement basic lighting setup (ambient + directional)
  - Add ground plane with grid helper for spatial reference
  - Create sample GLTF model loading example
  - _Requirements: 3.1, 3.3, 4.1, 4.2_

- [ ] 14. Implement visual feedback system
  - Create highlight shader for interactive objects on hover
  - Build gaze reticle cursor for gaze input
  - Add selection animation (scale pulse or color change)
  - Implement loading spinner for asset loading states
  - Create transition animations for XR entry/exit
  - _Requirements: 10.1, 10.2, 10.5_

- [ ] 15. Add development tools and debugging
  - Create debug overlay showing FPS, draw calls, and memory
  - Add XR session state indicator
  - Implement scene graph inspector (development only)
  - Add performance metrics logging
  - Create helper to visualize raycasts and interaction points
  - _Requirements: 6.5, 7.3, 9.5_

- [ ] 16. Configure build and deployment
  - Update next.config.js for static export
  - Configure webpack for Three.js optimization
  - Set up environment variables for asset paths
  - Create build script for production optimization
  - Add deployment scripts for Vercel/GitHub Pages
  - Configure HTTPS for local development (mkcert)
  - _Requirements: 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 8.5_

- [ ] 17. Implement error handling and fallbacks
  - Create XRError class with categories and user messages
  - Add try-catch blocks to all async operations
  - Implement fallback to inline mode when XR unavailable
  - Create placeholder assets for failed model loads
  - Add WebGL context lost recovery
  - Implement user-friendly error messages in UI
  - _Requirements: 1.3, 3.4, 10.3_

- [ ] 18. Optimize performance for target devices
  - Implement frustum culling verification
  - Add LOD (Level of Detail) for complex models
  - Configure texture compression (KTX2/Basis)
  - Optimize draw calls by merging static geometry
  - Implement lazy loading for non-critical assets
  - Add asset preloading strategy
  - _Requirements: 6.1, 6.3, 6.4_

- [ ] 19. Create integration tests with Playwright
  - Write test for XR session initialization flow
  - Test asset loading and scene setup
  - Test interaction workflows (gaze, click)
  - Test error scenarios and recovery
  - Test performance under load
  - _Requirements: 1.1, 3.1, 4.1_

- [ ] 20. Add documentation and examples
  - Write README with setup instructions
  - Document component APIs and usage
  - Create example scenes and interactions
  - Add inline code comments for complex logic
  - Document deployment process
  - _Requirements: 7.1, 8.2_

- [ ] 21. Final integration and polish
  - Test complete user flow from entry to XR session
  - Verify all interactions work across input methods
  - Test on Meta Quest device (if available)
  - Optimize bundle size and loading performance
  - Fix any remaining bugs or edge cases
  - Prepare demo scene for competition submission
  - _Requirements: 1.1, 1.5, 4.1, 4.2, 4.3, 6.1_
