/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Illustrates how to display and pick Polygons.
 *
 * @version $Id: Polygons.js 3320 2015-07-15 20:53:05Z dcollins $
 */

requirejs(['../src/WorldWind',
        '../examples/LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        // Tell World Wind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the World Window.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        /**
         * Add imagery layers.
         */
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }
		/*
        // Create a layer to hold the polygons.
        var polygonsLayer = new WorldWind.RenderableLayer();
        polygonsLayer.displayName = "Polygons";
        wwd.addLayer(polygonsLayer);
		*/

        // Define an outer and an inner boundary to make a polygon with a hole.
        var boundaries = [];
		var polygon = undefined; // Son.***
		var polygonAttributes = undefined; // Son.***
		var highlightAttributes = undefined; // Son.***
		

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);
		
		
		// Test son.**************************************************************************************************************************
		// Test son.**************************************************************************************************************************
		// Test son.**************************************************************************************************************************
		// Create a layer to hold the f4dBuildings.***********************************************************
        //var f4dBuildingsLayer = new WorldWind.RenderableLayer(); 
        //f4dBuildingsLayer.displayName = "F4DBuildings"; 
		//f4dBuildingsLayer.inCurrentFrame = true;  
        //wwd.addLayer(f4dBuildingsLayer); 
		
		// Create a layer to hold the f4d_tiles.**************************************************************
		var f4d_wwwLayer = new F4d_wwwLayer(); // Inside this layer, there are the f4d_www_Manager.***
		f4d_wwwLayer.wwd = wwd;

		var newRenderableLayer = new WorldWind.RenderableLayer();
		newRenderableLayer.displayName = "F4D tiles";
		newRenderableLayer.inCurrentFrame = true; // Test.***
        wwd.addLayer(newRenderableLayer);
		
		newRenderableLayer.addRenderable(f4d_wwwLayer);
		// End Create a layer to hold the f4dBuildings.-------------------------------------------------------
		
		var f4d_readerWriter = new f4d_ReaderWriter();
		
		var incre_latAng = 0.001;
		var incre_longAng = 0.001;
		var GAIA3D__offset_latitude = -0.001;
		var GAIA3D__offset_longitude = -0.001;
		var GAIA3D__counter = 0;
		//var gL = wwd.gl;
		var gL = wwd.drawContext.currentGlContext;
		var drawingBufferWidth = 1000;
		var drawingBufferHeight = 750;
		
		//var f4d_topManager = new f4d_manager(); // This is the top f4d class.***
		//f4d_topManager.f4dSelection.init(gL, drawingBufferWidth, drawingBufferHeight);
		f4d_wwwLayer.f4d_shadersManager.create_f4dDefaultShader(gL); 
		
		// Load function.****************************************************************************************************************
		gL = wwd.gl;
		var elevation = 60.0; 
		//elevation = 5000.0;
		//var BR_ProjectsList = f4d_topManager.f4dBR_buildingProjectsList;
		var latitude = 37.5172076;
		var longitude = 126.929;
		//f4d_readerWriter.openBuildingProject(wwd, f4d_wwwLayer, 100, latitude, longitude, elevation, f4d_readerWriter); //생활동.***																							
		f4d_readerWriter.openBuildingProject(wwd, f4d_wwwLayer, 8001, latitude, longitude, elevation, f4d_readerWriter); //생활동.***
		
		// Test reading tiles system.***
		f4d_readerWriter.openF4d_TerranTile(gL, f4d_wwwLayer.f4d_terranTile, f4d_readerWriter, wwd);
		//----------------------------------------------------------------------------------------------------------------------------------
		
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Click event. Is different to anothers event handlers.******************************************************
		// The common gesture-handling function.
		var handleClick = function (recognizer) {
			// Obtain the event location.
			var x = recognizer.clientX,
				y = recognizer.clientY;
				
			// Son.**********************************************************************
			// This must used for select objects.***
			// End son.------------------------------------------------------------------

			// Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
			// relative to the upper left corner of the canvas rather than the upper left corner of the page.
			var pickList = wwd.pick(wwd.canvasCoordinates(x, y));

			// If only one thing is picked and it is the terrain, use a go-to animator to go to the picked location.
			if (pickList.objects.length == 1 && pickList.objects[0].isTerrain) {
				var position = pickList.objects[0].position;
				goToAnimator.goTo(new WorldWind.Location(position.latitude, position.longitude));
			}
		};

		// Listen for mouse clicks.
		var clickRecognizer = new WorldWind.ClickRecognizer(wwd, handleClick);
		
		var mouseDownEvent = function(event)
		{
			// Mouse down.***
			f4d_wwwLayer.f4d_wwwManager.isCameraMoving = true;
		};
		wwd.addEventListener("mousedown", mouseDownEvent, false);
		
		var mouseUpEvent = function(event)
		{
			// Mouse up.***
			f4d_wwwLayer.f4d_wwwManager.isCameraMoving = false;
			
			//f4d_wwwLayer.calculate_modelViewProjectionMatrixRelativeToEye(dc); // Execute this in mousedown_handler.***!!!!!!!!!!!!
		};
		wwd.addEventListener("mouseup", mouseUpEvent, false);
		// End Click event.------------------------------------------------------------------------------------------
		//-----------------------------------------------------------------------------------------------------------
		
		
		/*
		function handleFolderSelect(evt)
        {
			gL = wwd.gl;
			var elevation = 60.0; 
			//elevation = 5000.0;
			//var BR_ProjectsList = f4d_topManager.f4dBR_buildingProjectsList;
			var latitude = 37.5172076;
			var longitude = 126.929;
			//f4d_readerWriter.openBuildingProject(wwd, f4d_wwwLayer, 100, latitude, longitude, elevation, f4d_readerWriter); //생활동.***																							
			f4d_readerWriter.openBuildingProject(wwd, f4d_wwwLayer, 8001, latitude, longitude, elevation, f4d_readerWriter); //생활동.***
			
			// Test reading tiles system.***
			f4d_readerWriter.openF4d_TerranTile(gL, f4d_wwwLayer.f4d_terranTile, f4d_readerWriter, wwd);
		}
		
		
		document.getElementById('files2').addEventListener('change', handleFolderSelect, false);
		*/
		// End test son.----------------------------------------------------------------------------------------------------------------------
		// End test son.----------------------------------------------------------------------------------------------------------------------
		// End test son.----------------------------------------------------------------------------------------------------------------------
		
		
    });
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	