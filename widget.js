/* global requirejs cprequire cpdefine chilipeppr THREE */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
   paths: {
       // Don't put .js at end of URL (except when passing thru CP geturl proxy)
        // Three: '//i2dcui.appspot.com/geturl?url=http://threejs.org/build/three.min.js',
        Three: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r76/three',
        ThreeTextGeometry: '//i2dcui.appspot.com/js/three/TextGeometry',
        ThreeFontUtils: '//i2dcui.appspot.com/js/three/FontUtils',
        ThreeHelvetiker: '//i2dcui.appspot.com/js/three/threehelvetiker',
        Clipper: '//i2dcui.appspot.com/js/clipper/clipper_unminified'
   },
   shim: {
       ThreeTextGeometry: ['Three'],
       ThreeFontUtils: ['Three', 'ThreeTextGeometry'],
       ThreeHelvetiker: ['Three', 'ThreeTextGeometry', 'ThreeFontUtils'],
   }
});

// Test this element. This code is auto-removed by the chilipeppr.load()
cprequire_test(["inline:com-chilipeppr-widget-eagle"], function (ew) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    console.log("test running of " + ew.id);
    //ew.init();

    $('#com-chilipeppr-widget-eagle').css('position', 'relative');
    $('#com-chilipeppr-widget-eagle').css('background', 'none');
    $('#com-chilipeppr-widget-eagle').css('width', '320px');
    $('body').prepend('<div id="3dviewer"></div>');

    chilipeppr.load(
      "#3dviewer",
      "http://raw.githubusercontent.com/chilipeppr/widget-3dviewer/master/auto-generated-widget.html",
      function() {
        cprequire(['inline:com-chilipeppr-widget-3dviewer'], function (threed) {
            threed.init({
                doMyOwnDragDrop: false
            });
            //$('#com-chilipeppr-widget-3dviewer .panel-heading').addClass('hidden');
            //autolevel.addRegionTo3d();
            //autolevel.loadFileFromLocalStorageKey('com-chilipeppr-widget-autolevel-recent8');
            //autolevel.toggleShowMatrix();

            // only init eagle widget once 3d is loaded
            // set doMyOwnDragDrop
            ew.init(true);
        });
    });

    $('body').prepend('<div id="test-drag-drop"></div>');
    chilipeppr.load("#test-drag-drop", "http://raw.githubusercontent.com/chilipeppr/elem-dragdrop/master/auto-generated-widget.html",

    function () {
        cprequire(
        ["inline:com-chilipeppr-elem-dragdrop"],

        function (dd) {
            dd.init();
            dd.bind("body", null);
        });
    });
    
    $('body').prepend('<div id="com-chilipeppr-flash"></div>');
    chilipeppr.load("#com-chilipeppr-flash",
        "http://raw.githubusercontent.com/chilipeppr/element-flash/master/auto-generated-widget.html",

    function () {
        console.log("mycallback got called after loading flash msg module");
        cprequire(["inline:com-chilipeppr-elem-flashmsg"], function (fm) {
            //console.log("inside require of " + fm.id);
            fm.init();
        });
    });
    
    // test before and after render
    chilipeppr.subscribe("/" + ew.id + '/beforeToolPathRender', this, function(eagleWidget) {
        console.log("publish test. got the /beforeToolPathRender signal. eagleWidget:", eagleWidget);
    });
    chilipeppr.subscribe("/" + ew.id + '/afterToolPathRender', this, function(eagleWidget) {
        console.log("publish test. got the /afterToolPathRender signal. eagleWidget:", eagleWidget);
    });
    // test before and after render
    chilipeppr.subscribe("/" + ew.id + '/beforeLayerGenerate', this, function(eagleWidget) {
        console.log("publish test. got the /beforeLayerGenerate signal. layer:", eagleWidget.activeLayer, "eagleWidget:", eagleWidget);
    });
    chilipeppr.subscribe("/" + ew.id + '/afterLayerGenerate', this, function(eagleWidget) {
        console.log("publish test. got the /afterLayerGenerate signal. layer:", eagleWidget.activeLayer, "eagleWidget:", eagleWidget);
    });


} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-widget-eagle", ["chilipeppr_ready", "Clipper", "jqueryuiWidget"], function () {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-widget-eagle",
        name: "Widget / Eagle BRD v5.8",
        desc: "This widget lets you drag in an Eagle PCB \".brd\" file to mill.",
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
            '/onAddGcode': `This signal lets a 3rd party add-on inject its own Gcode into the 
            overall final Gcode for the Eagle BRD Widget. Here is an example of how to subscribe. 

<pre>
chilipeppr.subscribe(
    "/com-chilipeppr-widget-eagle/addGcode", 
    this, 
    this.myOnAddGcode
    );
</pre>

            Then, your callback would look like this with 4 parameters receiving the variables 
            that the addGcode publish signal sends you. 

<pre>
onAddGcode : function(addGcodeCallback, gcodeParts, eagleWidget, helpDesc){ 
    console.log("Got onAddGcode:", arguments); 
    // this method calls back to the main Eagle widget to inject our Gcode 
    addGcodeCallback(1500, myOwnGcode ); 
} 
</pre>

            The 1500 in the example above is to attach a priority to where our Gcode will get positioned. 
            The base Gcode ends around line 900. The footer starts at line 2000. So putting our Gcode at 
            the end but before the footer means using 1500 should do fine. You can analyze the existing 
            Gcode by looking at parameter 2 gcodeParts to see if an index has already been used so you 
            don't clobber it. If you want to delete Gcode from gcodeParts you could do that as well and 
            the main widget will reflect the deletion. 
            `,
            '/beforeLayerGenerate' : `This widget fires a signal before generating the Three.js objects
                and Clipper paths for a board layer. The Three.js objects are 3D objects representing the
                pads, vias, smds, wires, polygons, and dimensions. Those Three.js objects are used to
                populate the 3D viewer and to calculate 2D Clipper paths from. 
                
                Clipper paths are the 2D XY
                values of all the layer's objects and are generated so that unions and diffs can be
                calculated on those paths in the render step. Clipper paths can be easily inflated and
                deflated by the Clipper.js library which is why they are so important to this widget.
                
                When you get this signal a reference to "this", i.e. the Eagle Widget, is included in
                the payload so you may use it to manipulate this widget as you see fit.`,
            '/afterLayerGenerate' : `Please see the /beforeLayerGenerate description to understand this
                signal better. The /afterLayerGenerate signal is fired after this widget is done
                generating the board layer. The payload is the same as the before signal.`,
            '/beforeToolPathRender' : `This widget fires a signal before the rendering of the tool path 
                for the milling of the Eagle BRD. As the user tests out different inflate values, you 
                will get this signal for each re-render of the tool path the user asks for, i.e. when 
                they click the "render" button.
                
                In the payload is a reference to "this" so you can possibly grab info or do other 
                manipulations of the board before we render the tool path. This is especially useful for add-on 
                widgets to the Eagle BRD widget such as the Solder Paste Dispenser Add-On or the
                Pick and Place Add-On.
                `,
            '/afterToolPathRender' : `This widget fires a signal after the rendering of the tool path 
                for the Eagle BRD. The tool path is the blue line in the 3D viewer.
                Similar to the /beforeToolPathRender signal, in the payload is a reference to "this" so you can possibly grab info or do other 
                manipulations of the board after we render. This is especially useful for add-on 
                widgets to the Eagle BRD widget such as the Solder Paste Dispenser Add-On or the
                Pick and Place Add-On.
                `
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
        
            '/getBoardData' : `Call this with a callback and you will immediately get back the baord data
                to your callback. Call like 
                chilipeppr.publish("/com-chilipeppr-eagle/getBoardData", mycallback);
                This returns all of the board data for you, so that you can know
                all of the information that this Eagle BRD widget created. You will get back data like:
                {
                    clipperBySignalKey: {}, // contains all signals (wires)
                    clipperDimension: {}, // contains dimension of board
                    clipperElements: {},
                    clipperPads: {}, // contains all pads (pads have holes)
                    clipperSignalPolys: {}, // polygons that are signals like a GND plane
                    clipperSignalWires: {}, // wires by name
                    clipperSmds: {}, // all the smd pads, i.e. where components sit for soldering
                    clipperVias: {}, // your vias. these have holes too.
                    eagle: {}, // the parsed Eagle BRD XML into a structure
                }`
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // '/jsonSend': 'Example: We send Gcode to the serial port widget to do stuff with the CNC controller.'
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            '/com-chilipeppr-elem-dragdrop/ondropped': 'We subscribe to this signal at a higher priority to intercept the signal, double check if it is an Eagle Brd file and if so, we do not let it propagate by returning false. That way the 3D Viewer, Gcode widget, or other widgets will not get Eagle Brd file drag/drop events because they will not know how to interpret them.'
        },
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         
         * If you are doing development on this widget, it's important to understand what
         * data is available to you after the board is parsed. This data can enable you to
         * do enhanced operations. For example, I'm working on creating laser paths to laser
         * out the solder mask to reveal the underlying pads and smds. I had to re-figure out
         * what data is available to figure out those laser paths. Here's my summary. -Jlauer
         * 
         * Why clipper? Clipper is the library used to do boolean operations on polygons. Eagle
         * gives us XY values for everything, and if we are to combine those into overall paths
         * for milling, etc, then we need to merge those polygons. The clipper items below represent
         * the clean final version of all that merging.
         * 
         *   clipperBySignalKey: {}, // contains all signals (wires)
         *   clipperDimension: {}, // contains dimension of board
         *   clipperElements: {},
         *   clipperPads: {}, // contains all pads (pads have holes)
         *   clipperSignalPolys: {}, // polygons that are signals like a GND plane
         *   clipperSignalWires: {}, // wires by name
         *   clipperSmds: {}, // all the smd pads, i.e. where components sit for soldering
         *   clipperVias: {}, // your vias. these have holes too.
         *   eagle: {}, // the parsed Eagle BRD XML into a structure
         */
        init: function (doMyOwnDragDrop) {
            
            // the workspace may want to handle the drag drop
            // but when in dev mode it makes sense for us to do our own
            if (doMyOwnDragDrop) {
                this.setupDragDrop();
            } else {
                // the workspace is doing the drag/drop. this is important
                // because this code base for this widget is huge and thus
                // the workspace should handle dragging in BRD files
                // and once it sees one, it should then load this widget
                // so that users who don't use ChiliPeppr for BRD files
                // don't have to load all this insane code
                
            }
            
            this.setupFrequentThreeFeatures();  //global definition of frequently used Three features
            
            this.setupUiFromLocalStorage();

            this.btnSetup();

            //this.status("Loaded...");

            this.forkSetup();

            this.lazyLoadTutorial();

            //$('#com-chilipeppr-widget-eagle .btnAnimate').click( this.animateOverlapPath.bind(this) );

            this.setupBlankBoardParamenters();
            this.setupRegHolesParamenters();
            
            // init 3d for eagle widget
            this.init3d();

            this.setupMouseOver();
            
            this.setupAdvancedInflateByUI();
            
            this.setupGcodeTab();
            this.setupFeedsDepths();
            
            // setup clear button
            $('#com-chilipeppr-widget-eagle .btn-clear').click(this.clearEagleBrd.bind(this));
            
            this.setupMirrorAxis(); //V5.1D20161229 - Added
            
            this.setupTabParameters();
            
            this.setupLayerToggleDropdown();
            
            //this.setupBoardMirrorCheckboxes(); V5.1D20161229 - Commented
            
            this.setupSolderMaskTab();

            console.log(this.name + " done loading.");
        },
        blankBoard: {
            use: false,
            x: 0,
            y: 0,
            width: 150,
            height: 100
        },
        blankBoardSceneGroup: null,
        setupBlankBoardParamenters: function() {
            $("#com-chilipeppr-widget-eagle .use-blank-pcb").prop("checked", this.blankBoard.use);
            $("#com-chilipeppr-widget-eagle .blank-pcb-width").val(this.blankBoard.width);
            $("#com-chilipeppr-widget-eagle .blank-pcb-height").val(this.blankBoard.height);
            $("#com-chilipeppr-widget-eagle .blank-pcb-x").val(this.blankBoard.x);
            $("#com-chilipeppr-widget-eagle .blank-pcb-y").val(this.blankBoard.y);
            
            $("#com-chilipeppr-widget-eagle .use-blank-pcb").change(this.onChangeBlankBoardParamenters.bind(this));
            $("#com-chilipeppr-widget-eagle .blank-pcb-width").change(this.onChangeBlankBoardParamenters.bind(this));
            $("#com-chilipeppr-widget-eagle .blank-pcb-height").change(this.onChangeBlankBoardParamenters.bind(this));
            $("#com-chilipeppr-widget-eagle .blank-pcb-x").change(this.onChangeBlankBoardParamenters.bind(this));
            $("#com-chilipeppr-widget-eagle .blank-pcb-y").change(this.onChangeBlankBoardParamenters.bind(this));
        },
        onChangeBlankBoardParamenters: function() {
            this.blankBoard.use = $("#com-chilipeppr-widget-eagle .use-blank-pcb").prop("checked");
            $("#com-chilipeppr-widget-eagle .use-reg-holes").prop("disabled", !this.blankBoard.use);
            if(this.blankBoard.use)
                $("#com-chilipeppr-widget-eagle .reg-holes-note").hide();
            else
                $("#com-chilipeppr-widget-eagle .reg-holes-note").show();
            console.log("Ameen", $("#com-chilipeppr-widget-eagle .reg-holes-note"));
            var item = $("#com-chilipeppr-widget-eagle .blank-pcb-x");
            if (item.val() == "") item.val(this.blankBoard.x); else this.blankBoard.x = parseFloat(item.val());
            
            item = $("#com-chilipeppr-widget-eagle .blank-pcb-y");
            if (item.val() == "") item.val(this.blankBoard.y); else this.blankBoard.y = parseFloat(item.val());
            
            item = $("#com-chilipeppr-widget-eagle .blank-pcb-width");
            if (item.val() == "") item.val(this.blankBoard.width); 
            else {
                var v = parseFloat(item.val()), min = parseFloat(item[0].min);
                if(v<min) {v = min; item.val(v);}
                this.blankBoard.width = v;
            }
            
            item = $("#com-chilipeppr-widget-eagle .blank-pcb-height");
            if (item.val() == "") item.val(this.blankBoard.height); 
            else {
                var v = parseFloat(item.val()), min = parseFloat(item[0].min);
                if(v<min) {v = min; item.val(v);}
                this.blankBoard.height = v;
            }
            
            if(this.blankBoardSceneGroup != null) this.sceneRemove(this.blankBoardSceneGroup);
            
            this.draw3dBlankBoard();
            
            if(this.regHolesSceneGroup != null) this.sceneRemove(this.regHolesSceneGroup);
            
            this.regHoles.holes = this.getRegHoles();
            this.draw3dRegHoles();
            this.exportGcodeRegistrationHoles();
            
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/drawextents' );
        },
        draw3dBlankBoard: function(){
            if(!this.blankBoard.use) return;
            
            var x1 = this.blankBoard.x,
                x2 = this.blankBoard.x + this.blankBoard.width,
                y1 = this.blankBoard.y,
                y2 = this.blankBoard.y + this.blankBoard.height;
                
            this.blankBoundaries = {
                MinimumX: x1,
                MinimumY: y1,
                MaximumX: x2,
                MaximumY: y2
            };
                
            var regColor = 0xB87333;
            var lineMat = new THREE.LineBasicMaterial({
                color: regColor,
                transparent: true,
                opacity: .4
            });
            var lineGeo = new THREE.Geometry();
            
            lineGeo.vertices.push(new THREE.Vector3(x1, y1, 0));
            lineGeo.vertices.push(new THREE.Vector3(x2, y1, 0));
            lineGeo.vertices.push(new THREE.Vector3(x2, y2, 0));
            lineGeo.vertices.push(new THREE.Vector3(x1, y2, 0));
            lineGeo.vertices.push(new THREE.Vector3(x1, y1, 0));
            
            var line = new THREE.Line(lineGeo, lineMat);
            
            this.blankBoardSceneGroup = new THREE.Group();
            this.blankBoardSceneGroup.add(line);
            this.sceneAdd(this.blankBoardSceneGroup);
        },
        
        regHoles: {
            use: true,
            pattern: 201,
            diameter: 3.175,
            distance: 1,
            holes: []
        },
        regHoleGcodePara: {
            depth: -1.7,
            clearance: 2,
            feedrate: 200,
            spindleRPM: 1200
        },
        regHolesSceneGroup: null,
        setupRegHolesParamenters: function() {
            $("#com-chilipeppr-widget-eagle .use-reg-holes").prop("checked", this.regHoles.use);
            $("#com-chilipeppr-widget-eagle .use-reg-holes").prop("disabled", !this.blankBoard.use);
            $("#com-chilipeppr-widget-eagle #reg-holes-pattern").val(this.regHoles.pattern);
            $("#com-chilipeppr-widget-eagle .reg-holes-diameter").val(this.regHoles.diameter);
            $("#com-chilipeppr-widget-eagle .reg-holes-distance").val(this.regHoles.distance);
            
            $("#com-chilipeppr-widget-eagle .reg-holes-depth").val(this.regHoleGcodePara.depth);
            $("#com-chilipeppr-widget-eagle .reg-holes-clearance").val(this.regHoleGcodePara.clearance);
            $("#com-chilipeppr-widget-eagle .reg-holes-feedrate").val(this.regHoleGcodePara.feedrate);
            $("#com-chilipeppr-widget-eagle .reg-holes-spindle-rpm").val(this.regHoleGcodePara.spindleRPM);
            
            $("#com-chilipeppr-widget-eagle .use-reg-holes").change(this.onChangeRegHolesParamenters.bind(this));
            $("#com-chilipeppr-widget-eagle #reg-holes-pattern").change(this.onChangeRegHolesParamenters.bind(this));
            $("#com-chilipeppr-widget-eagle .reg-holes-diameter").change(this.onChangeRegHolesParamenters.bind(this));
            $("#com-chilipeppr-widget-eagle .reg-holes-distance").change(this.onChangeRegHolesParamenters.bind(this));
            
            $("#com-chilipeppr-widget-eagle .reg-holes-sendgcodetows").click(this.sendRegHoleGcodeToWorkspace.bind(this));
            
            $("#com-chilipeppr-widget-eagle .reg-holes-depth").change(this.onChangeRegHolesGcodeParamenters.bind(this));
            $("#com-chilipeppr-widget-eagle .reg-holes-clearance").change(this.onChangeRegHolesGcodeParamenters.bind(this));
            $("#com-chilipeppr-widget-eagle .reg-holes-feedrate").change(this.onChangeRegHolesGcodeParamenters.bind(this));
            $("#com-chilipeppr-widget-eagle .reg-holes-spindle-rpm").change(this.onChangeRegHolesGcodeParamenters.bind(this));
            this.regHoles.holes = this.getRegHoles();
        },
        onChangeRegHolesGcodeParamenters: function() {
            var item = $("#com-chilipeppr-widget-eagle .reg-holes-depth");
            if (item.val() == "") item.val(this.regHoleGcodePara.depth); 
            else {
                var v = parseFloat(item.val()), min = parseFloat(item[0].min), max = parseFloat(item[0].max);
                if(v>max) {v = max; item.val(v);}
                if(v<min) {v = min; item.val(v);}
                this.regHoleGcodePara.depth = v;
            }
            
            item = $("#com-chilipeppr-widget-eagle .reg-holes-clearance");
            if (item.val() == "") item.val(this.regHoleGcodePara.clearance); 
            else {
                var v = parseFloat(item.val()), min = parseFloat(item[0].min);
                if(v<min) {v = min; item.val(v);}
                this.regHoleGcodePara.clearance = v;
            }
            
            item = $("#com-chilipeppr-widget-eagle .reg-holes-feedrate");
            if (item.val() == "") item.val(this.regHoleGcodePara.feedrate); 
            else {
                var v = parseFloat(item.val()), min = parseFloat(item[0].min);
                if(v<min) {v = min; item.val(v);}
                this.regHoleGcodePara.feedrate = v;
            }
            item = $("#com-chilipeppr-widget-eagle .reg-holes-spindle-rpm");
            if (item.val() == "") item.val(this.regHoleGcodePara.spindleRPM); 
            else {
                var v = parseFloat(item.val()), min = parseFloat(item[0].min);
                if(v<min) {v = min; item.val(v);}
                this.regHoleGcodePara.spindleRPM = v;
            }
        },
        onChangeRegHolesParamenters: function() {
            this.regHoles.use = $("#com-chilipeppr-widget-eagle .use-reg-holes").prop("checked");

            this.regHoles.pattern = parseInt($('#com-chilipeppr-widget-eagle #reg-holes-pattern').val());
            var item = $("#com-chilipeppr-widget-eagle .reg-holes-diameter");
            if (item.val() == "") item.val(this.regHoles.diameter); 
            else {
                var v = parseFloat(item.val()), min = parseFloat(item[0].min), max = parseFloat(item[0].max);
                if(v>max) {v = max; item.val(v);}
                if(v<min) {v = min; item.val(v);}
                this.regHoles.diameter = v;
            }
            
            item = $("#com-chilipeppr-widget-eagle .reg-holes-distance");
            if (item.val() == "") item.val(this.regHoles.distance); 
            else {
                var v = parseFloat(item.val()), min = parseFloat(item[0].min), max = parseFloat(item[0].max);
                if(v>max) {v = max; item.val(v);}
                if(v<min) {v = min; item.val(v);}
                this.regHoles.distance = v;
            }
                
            this.regHoles.holes = this.getRegHoles();

            if(this.regHolesSceneGroup != null)
                this.sceneRemove(this.regHolesSceneGroup);
            this.draw3dRegHoles();
            this.exportGcodeRegistrationHoles();
        },
        getRegHoles: function(){
            var pattern = this.regHoles.pattern;
            var count = Math.round(pattern/100);
            var onSides = Math.round((pattern - 100 * count)/10) == 1;
            var v = (pattern - 100 * count - 10 * onSides) == 0;
            
            var x = this.blankBoard.x,
                y = this.blankBoard.y,
                w = this.blankBoard.width,
                h = this.blankBoard.height,
                d = this.regHoles.distance + this.regHoles.diameter/2;
            
            var holes = [];
            if(count == 4){
                holes.push({x: x + d,                 y: y + (onSides?h/2:d)});
                holes.push({x: x + (onSides?w/2:d),   y: y + h - d});
                holes.push({x: x + w - d,             y: y + (onSides?h/2:h-d)});
                holes.push({x: x + (onSides?w/2:w-d), y: y + d});
            }
            else {
                holes.push({x: x + (onSides?(v?w/2:d)  :d  ), y: y + (onSides?(v?d:h/2)  :(v?d:h-d))});
                holes.push({x: x + (onSides?(v?w/2:w-d):w-d), y: y + (onSides?(v?h-d:h/2):(v?h-d:d))});
            }

            return holes;
        },
        draw3dRegHoles: function(){
            if(!this.regHoles.use || !this.blankBoard.use) return;
            var that = this;
            var r = this.regHoles.diameter/2;
            var regColor = 0xB87333;
            var lineMat = new THREE.LineBasicMaterial({
                color: regColor,
                transparent: true,
                opacity: .4
            });
            
            this.regHolesSceneGroup = new THREE.Group();
            var that = this;
            this.regHoles.holes.forEach(function(hole){
                var line = that.drawCircle(hole.x, hole.y, r, regColor, 32, .4);
                line.rotateZ(Math.PI / 8);
                that.regHolesSceneGroup.add(line);
                var line1Geo = new THREE.Geometry();
                line1Geo.vertices.push(new THREE.Vector3(hole.x-r/2, hole.y, 0));
                line1Geo.vertices.push(new THREE.Vector3(hole.x+r/2, hole.y, 0));
                var line1 = new THREE.Line(line1Geo, lineMat);
                var line2Geo = new THREE.Geometry();
                line2Geo.vertices.push(new THREE.Vector3(hole.x, hole.y-r/2, 0));
                line2Geo.vertices.push(new THREE.Vector3(hole.x, hole.y+r/2, 0));
                var line2 = new THREE.Line(line2Geo, lineMat);
                that.regHolesSceneGroup.add(line1);
                that.regHolesSceneGroup.add(line2);
            });
            this.sceneAdd(this.regHolesSceneGroup);
        },
        exportGcodeRegistrationHoles: function() {

            var holes = this.regHoles.holes;
            if(holes.length < 2 || !this.regHoles.use) {
                $('#com-chilipeppr-widget-eagle .reg-holes-gcode').text("");
                return;
            }

            var clearanceHeight = $("#com-chilipeppr-widget-eagle .reg-holes-clearance").val();
            var drillDepth = $("#com-chilipeppr-widget-eagle .reg-holes-depth").val();
            var drillFeedrate = $("#com-chilipeppr-widget-eagle .reg-holes-feedrate").val();
            var spindleRPM = $("#com-chilipeppr-widget-eagle .reg-holes-spindle-rpm").val();
            var toolDia = this.regHoles.diameter;
            var g = '';
            g += "(Gcode generated by ChiliPeppr Eagle PCB Widget " + (new Date()).toLocaleString() + ")\n";
            g += "G21 (mm mode)\n";
            g += "G90 (abs mode)\n";
            g += "(------ DRILLING REGISTRATION HOLES -------)\n";
            g += "M5 (spindle off)\n";
            g += "T0 M6 (Drilling holes - diameter " + toolDia + "mm)\n";
            g += "(T0 D=" + toolDia + "mm - PCB Drill Bit)\n";
            g += "M3 S" + spindleRPM + " (spindle on)\n";
            g += "F" + drillFeedrate + "\n";
            holes.forEach(function(hole){
                g += "G0 Z" + clearanceHeight + "\n";
                g += "G0 X" + hole.x + " Y" + hole.y   + "\n";
                g += "G0 Z" + clearanceHeight/10 + "\n";
                g += "G1 Z" + drillDepth  + "\n";
                g += "G1 Z" + clearanceHeight/10 + "\n";
            });
            g += "G0 Z" + clearanceHeight + "\n";
            g += "M5 (spindle stop)\n";
            g += "M30 (prog stop)\n";
            
            $('#com-chilipeppr-widget-eagle .reg-holes-gcode').text(g);

        },
        sendRegHoleGcodeToWorkspace: function(){
            this.exportGcodeRegistrationHoles();
            var info = {
                name: "Eagle Registration Holes", 
                lastModified: new Date()
            };
            // grab gcode from textarea
            var gcodetxt = $('.reg-holes-gcode').text();
            
            if (gcodetxt.length < 10) {
                chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Error Sending Gcode", "It looks like you don't have any Gcode to send to the workspace. Huh?", 5 * 1000);
                return;
            }
            
            // send event off as if the file was drag/dropped
            chilipeppr.publish("/com-chilipeppr-elem-dragdrop/ondropped", gcodetxt, info);
            
            chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Sent Gcode to Workspace", "Sent your solder mask Gcode to the workscape. Close the Eagle widget to see it.");
            
            var that = this;
            this.get3dObj(function() {
                console.log("got callback after 3dviewer re-sent us the 3dobj and 3dobjmeta. 3dobj:", that.obj3d, "obj3dmeta:", that.obj3dmeta);
                that.sceneReAddMySceneGroup();
            });
        },
        /**
         * This sets up the tab to generate solder mask Gcode.
         */
        setupSolderMaskTab: function() {

            console.log("setup soldermask");
            var that = this;

            $('.com-chilipeppr-widget-eagle-soldermask-render').click(this.solderMaskRender.bind(this));
            $('.com-chilipeppr-widget-eagle-soldermask-showAsLine').click(this.solderMaskRender.bind(this));
            $('.com-chilipeppr-widget-eagle-soldermask-showAsMesh').click(this.solderMaskRender.bind(this));
            $('.com-chilipeppr-widget-eagle-soldermask-full').click(this.solderMaskRender.bind(this));
            $('.com-chilipeppr-widget-eagle-soldermask-outline').click(this.solderMaskRender.bind(this));
            $('.eagle-soldermask-regen-onrender').on('blur', this.solderMaskRender.bind(this));
            $('.eagle-soldermask-regen-onrender-click').on('click', this.solderMaskRender.bind(this));
            
            $('.eagle-soldermask-regen-onblur').on('blur', this.solderMaskGenerateGcode.bind(this));
            $('.eagle-soldermask-regen-onchange').on('change', this.solderMaskGenerateGcode.bind(this));
            
            $('.btn-eagle-soldermask-sendgcodetows').click(this.solderMaskSendGcodeToWorkspace.bind(this));
            
            // if outline turned on, hide the overlap choice
            $('.com-chilipeppr-widget-eagle-soldermask-outline').click(function() {
                var isOutlineOnly = $('.com-chilipeppr-widget-eagle-soldermask-outline').is(":checked");
                if (isOutlineOnly) {
                    // hide overlap input textbox
                    $('.com-chilipeppr-widget-soldermask-laser-overlapRegion').addClass("hidden");
                
                    // if outline is shown, show 3 sub-choices
                    $('.com-chilipeppr-widget-eagle-soldermask-outlineRegion').removeClass("hidden");
                }
            });
            $('.com-chilipeppr-widget-eagle-soldermask-full').click(function() {
                var isOutlineOnly = $('.com-chilipeppr-widget-eagle-soldermask-outline').is(":checked");
                if (!isOutlineOnly) {
                    // show overlap input textbox
                    $('.com-chilipeppr-widget-soldermask-laser-overlapRegion').removeClass("hidden");
                
                    // if outline is not shown, hide 3 sub-choices
                    $('.com-chilipeppr-widget-eagle-soldermask-outlineRegion').addClass("hidden");
                }
            });
            
            // based on mode, show/hide different sub-items
            $('.eagle-soldermask-modetype').click(function() {
                console.log("got click on mode type radio");
                var mode = $('#' + that.id + ' input[name=com-chilipeppr-widget-eagle-soldermask-mode]:checked').val();
                var laseron = $('#' + that.id + ' input[name=com-chilipeppr-widget-eagle-soldermask-laseron]:checked').val();
                console.log("mode:", mode, "laseron:", laseron);
                
                // if OutN selected, hide other options, show outn options
                // if cayenn, show those options
                $('.eagle-soldermask-modeoutN').addClass('hidden');
                $('.eagle-soldermask-modecayenn').addClass('hidden');
                $('.eagle-soldermask-modem3').addClass('hidden');
                $('.eagle-soldermask-mode-millRegion').addClass('hidden');

                if (mode == "laser") {
                    if (laseron == "outN") {
                        $('.eagle-soldermask-modeoutN').removeClass('hidden');
                    } else if (laseron == "cayenn") {
                        $('.eagle-soldermask-modecayenn').removeClass('hidden');
                    } else if (laseron == "M3") {
                        $('.eagle-soldermask-modem3').removeClass('hidden');
                    }
                } else {
                    // mode is mill
                    $('.eagle-soldermask-mode-millRegion').removeClass('hidden');
                }
            });
            
            // invert show/hide
            $('.com-chilipeppr-widget-eagle-soldermask-invert').click(function() {
                var isInvert = $('#' + that.id + ' input[name=com-chilipeppr-widget-eagle-soldermask-invert]:checked').val();
                if (isInvert) {
                    $('.com-chilipeppr-widget-eagle-soldermask-invert-insetRegion').removeClass("hidden");
                } else {
                    $('.com-chilipeppr-widget-eagle-soldermask-invert-insetRegion').addClass("hidden");
                }
            });

            // when tab is shown, render solder mask
            $('#' + this.id + ' a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                console.log("tab shown. e:", e);
                if ($(e.target).text() == 'Solder Mask') {
                    // our tab got shown
                    console.log("Solder Mask tab showing");
                    setTimeout(that.solderMaskRender.bind(that), 100);
                } else {
                    // since a different tab is showing, hide ours
                    console.log("Solder Mask tab hidden");
                    setTimeout(that.solderMaskRenderHide.bind(that), 10);
                }
            });
            // $('#' + this.id + ' a[data-toggle="tab"]').on('hide.bs.tab', function (e) {
            //     console.log("tab hidden. e:", e);
            //     if ($(e.target).text() == 'Solder Mask') {
            //         // our tab got shown
            //         console.log("Solder Mask tab hidden");
            //         setTimeout(that.solderMaskRenderHide.bind(that), 10);
            //     }
            // });
        },
        solderMaskRenderHide: function() {
            if (this.solderMaskGrp != null) {
                // this means we ran previously, and we should remove
                this.sceneRemove(this.solderMaskGrp);
                this.solderMaskGrp = null;
            }
        },
        solderMaskGrp: null, // holds all THREE.js objects for solder mask
        solderMaskGcodePath: [],  // array of arrays of line paths
        /**
         * Look at all the pads/smds and render a path based on what the user gave us in
         * the solder mask tab.
         */
        solderMaskRender: function() {
            console.log("solderMaskRender");
            
            $('.com-chilipeppr-widget-eagle-infoTemp')
                .html("Rendering path...")
                .removeClass("hidden");
            setTimeout(this.solderMaskRenderCallback.bind(this), 10);    
        },
        solderMaskRenderCallback: function() {
            // we will use clipperPads and clipperSmds
            
            // create our overall THREE group
            if (this.solderMaskGrp != null) {
                // this means we ran previously, and we should remove
                this.sceneRemove(this.solderMaskGrp);
            }
            
            this.solderMaskGrp = new THREE.Group();
            
            // reset the final Gcode path
            this.solderMaskGcodePath = [];
            
            this.solderMaskGcodePath.push("move to safe height");
            
            // get user width of laser or end mill
            var w = 0.1; // mm
            w = $('.com-chilipeppr-widget-soldermask-laser-width').val();
            
            // get user overlap of path
            var overlapPct = 20; // mm
            overlapPct = $('.com-chilipeppr-widget-soldermask-laser-overlap').val();
            
            // see if user wants to see actual path
            var isShowAsMesh = true;
            isShowAsMesh = $('.com-chilipeppr-widget-eagle-soldermask-showAsMesh').is(":checked");
            
            var isOutlineOnly = false;
            isOutlineOnly = $('.com-chilipeppr-widget-eagle-soldermask-outline').is(":checked");
            
            var outlineOut, outlineOn, outlineIn;
            if (isOutlineOnly) {
                outlineOut = $('.com-chilipeppr-widget-eagle-soldermask-outlineOutside').is(":checked");
                outlineOn = $('.com-chilipeppr-widget-eagle-soldermask-outlineOn').is(":checked");
                outlineIn = $('.com-chilipeppr-widget-eagle-soldermask-outlineInside').is(":checked");
            }
            var isIncludeDimensions = $('.com-chilipeppr-widget-eagle-soldermask-outlineDimensions').is(":checked");
            
            var isInvert = false;
            isInvert = $('.com-chilipeppr-widget-eagle-soldermask-invert').is(":checked");
            
            // hide the alert. we'll show it below if we find a path we can't render for
            $('.eagle-soldermask-alert').addClass("hidden");
            
            // create new array of pads and smds
            var padsAndSmds = [];
            padsAndSmds = padsAndSmds.concat(this.clipperPads.slice(0)); // clone
            padsAndSmds = padsAndSmds.concat(this.clipperSmds.slice(0)); // clone
            
            // if invert, branch to alternate render method just to keep stuff clean
            // we probably should move the normal render to a method like this as well
            // to keep the approaches parallel
            if (isInvert) {
                var opts = {
                    width: w,
                    overlapPct: overlapPct,
                    isShowAsMesh: isShowAsMesh,
                    isOutlineOnly: isOutlineOnly,
                    outlineOut: outlineOut,
                    outlineOn: outlineOn,
                    outlineIn: outlineIn,
                    gcodePath: this.solderMaskGcodePath,
                    threeGrp: this.solderMaskGrp,
                    padsAndSmds: padsAndSmds,
                    clipperDimension: this.clipperDimension,
                    // dimensions: this.clipperDimensions,
                }
                this.solderMaskRenderInvert(opts);
                return;
            }
            
            padsAndSmds.forEach(function(pad) {
                console.log("pad:", pad);
                
                this.solderMaskGcodePath.push("move to pad/smd start");
                
                var deflateBy = w * (1 - overlapPct / 100) * -1;
                
                if (isOutlineOnly) {
                    // we change the deflateBy relevant to their settings
                    if (outlineOut) deflateBy = (w / 2) * 1;
                    if (outlineOn) deflateBy = 0.001;
                    if (outlineIn) deflateBy = (w / 2) * -1;
                }
                
                var deflatePath = [pad.slice(0)];
                
                // deflate until gone
                var isStillAPath = true;
                
                // store last path so we can reference it on each deflate for a path from it's
                // last point to our start point
                var lastDeflatePath = null;
                
                // count times thru while loop so on 2nd loop we can trick
                // if the user just wants an outline
                var whileCtr = 0;
                
                while(isStillAPath) {
                    // use deflate mechanism. deflate by width of laser/end mill and use that as path
                    // then keep deflating until we have nothing left
                    deflatePath = this.getInflatePath(deflatePath, deflateBy);
                    
                    console.log("deflatePath:", deflatePath);
                    
                    // check if 1st time thru we get no path. if so, show alert
                    if (whileCtr == 0 && deflatePath.length == 0) {
                        $('.eagle-soldermask-alert').removeClass("hidden");
                    }
                    
                    whileCtr++;
                    
                    // if outline only, we want to come into this loop once
                    // and then trick it to think we're done
                    if (isOutlineOnly && whileCtr == 2) {
                        console.log("isOutlineOnly so forcing that 2nd deflatePath is empty to trick that we are done");
                        isStillAPath = false;
                        // lastDeflatePath = null;
                        break;  // jump out of while loop
                    }
                    
                    if (deflatePath.length > 0) {
                        
                        // there is still a path
                        isStillAPath = true;
                        
                        // since we have a path here, see if we had a lastDeflatePath, cuz if
                        // we did we should draw a line from it to our start to mimic the path
                        // the laser / end mill will take to get into this inner path.
                        if (lastDeflatePath != null) {
                            // yes, we had a last path
                            var lastPath = lastDeflatePath[0];
                            var lastPt = lastPath[0]; // lastPath[lastPath.length - 1];
                            var newPath = deflatePath[0];
                            var newPt = newPath[0];
    
                            var clipperLine = [[lastPt, newPt]];
                            this.drawPathAsLineOrMesh(clipperLine, w, isShowAsMesh, this.solderMaskGrp);
                            
                            // push this line onto gcode array
                            this.solderMaskGcodePath.push(clipperLine);

                        }
                        
                        // draw the actual main path we're working on here
                        this.drawPathAsLineOrMesh(deflatePath, w, isShowAsMesh, this.solderMaskGrp);
                        
                        // push this line onto gcode array
                        this.solderMaskGcodePath.push(deflatePath);

                    } else {
                        // no path left, so done deflating
                        isStillAPath = false;
                        
                        console.log("done deflating. lastDeflatePath:", lastDeflatePath);
                        
                        // however, we need to draw a line to the center to make sure we laser/cut
                        // all of the pad/smd
                        
                        // make sure there is a lastDeflatePath
                        if (lastDeflatePath != null) {

                            // get middle of pad
                            // do this by creating a three.js mesh, then using bounding box
                            var mesh = this.getMeshLineFromClipperPath({clipperPath:lastDeflatePath});
                            console.log("mesh of lastDeflatePath. mesh:", mesh);
                            
                            // get center
                            var centroid = this.getCentroid(mesh.children[1].children[0]);
    
                            // get point of last deflatePath and draw line to center
                            console.log("centroid:", centroid, "lastDeflatePath:", lastDeflatePath);
                            //lastDeflatePath[lastDeflatePath.length - 1];
                            var lastPath = lastDeflatePath[0];
                            var lastPt = lastPath[0]; // lastPath[lastPath.length - 1];
    
                            var clipperLine = [[{X:lastPt.X, Y:lastPt.Y}, {X:centroid.x, Y:centroid.y}]];
                            
                            this.drawPathAsLineOrMesh(clipperLine, w, isShowAsMesh, this.solderMaskGrp);
                            
                            // push this line onto gcode array
                            this.solderMaskGcodePath.push(clipperLine);
                        }
                        
                    }
                    
                    lastDeflatePath = deflatePath;
                }
                
                
            }, this);

            // see if they want to include dimensions as well
            if (isIncludeDimensions) {
                
                this.solderMaskGcodePath.push("move to dimensions start");
                
                // add this path
                this.drawPathAsLineOrMesh([this.clipperDimension], w, isShowAsMesh, this.solderMaskGrp);
                            
                // push this line onto gcode array
                this.solderMaskGcodePath.push([this.clipperDimension]);
            }
            
            // ok, now add our group
            this.sceneAdd(this.solderMaskGrp);
            
            $('.com-chilipeppr-widget-eagle-infoTemp')
                .addClass("hidden");
                
            // might as well generate gcode
            this.solderMaskGenerateGcode();
            
            // var that = this;
            // this.get3dObj(function() {
            //     console.log("got callback after 3dviewer re-sent us the 3dobj and 3dobjmeta. 3dobj:", that.obj3d, "obj3dmeta:", that.obj3dmeta);
            //     that.sceneReAddMySceneGroup();
            // });
        
        },
        /**
         * This method renders an inverse path for lasering/milling. This can be used
         * to expose a solder mask with UV laser light outside of the pads. Then the
         * pads can be washed off to expose the copper.
         * 
         * opts = {
                width: w,
                isShowAsMesh: isShowAsMesh,
                isOutlineOnly: isOutlineOnly,
                outlineOut: outlineOut,
                outlineOn: outlineOn,
                outlineIn: outlineIn,
                gcodePath: this.solderMaskGcodePath,
                // threeGrp: this.solderMaskGrp,
                padsAndSmds: padsAndSmds,
                clipperDimension: this.clipperDimension,
            }
         */
        solderMaskRenderInvert: function(opts) {
            
            console.log("solderMaskRenderInvert. opts:", opts);
            
            $('.com-chilipeppr-widget-eagle-infoTemp')
                .html("Rendering invert path...")
                .removeClass("hidden");
                
            setTimeout(this.solderMaskRenderInvertCallback.bind(this, opts), 30);    
        },
        solderMaskRenderInvertCallback: function(opts) {
            
            console.log("solderMaskRenderInvert. opts:", opts);
            
            // create polygon squares across the board. then remove out the pads/smds
            
            // clipper arrays are inside array
            var clipperDimension = [opts.clipperDimension];
            
            // deflate dimensions by width
            var w = (opts.width / 2) * -1;
            w = 0; // for now 
            clipperDimension = this.getInflatePath(clipperDimension, w);
            // clipperDimension = this.getInflatePath(clipperDimension, opts.width * -1);
            
            var isDblTrace = $('.com-chilipeppr-widget-eagle-soldermask-invert-dbltrace').is(":checked");
            var isTraceOutside = $('.com-chilipeppr-widget-eagle-soldermask-invertOutside').is(":checked");
            var isTraceOn = $('.com-chilipeppr-widget-eagle-soldermask-invertOn').is(":checked");
            var isTraceInside = $('.com-chilipeppr-widget-eagle-soldermask-invertInside').is(":checked");
            
            // var threeDim = this.drawClipperPaths(clipperDimension, 0xff0000, 0.9, 1);
            // this.sceneRemove(threeDim);
            // this.solderMaskGrp.add(threeDim);
            // console.log("threeDim:", threeDim);
            
            // now remove the pads so they are holes from the dimensions
            var clipperDiff = this.getDiffOfClipperPaths(clipperDimension, opts.padsAndSmds);
            console.log("clipperDiff:", clipperDiff);
            // var threePads = this.drawClipperPaths(clipperDiff, 0xff0000, 0.9, 1);
            // this.solderMaskGrp.add(threePads);
            // console.log("threePads:", threePads);
            
            // now deflate by half width of laser / end mill
            // this is the default for the trace starting on outside of pads
            var firstWidthToDeflateBy = (opts.width / 2) * -1;
            if (isTraceOn) firstWidthToDeflateBy = 0.001;
            if (isTraceInside) firstWidthToDeflateBy = opts.width;
            
            var clipperFirstPath = this.getInflatePath(clipperDiff, firstWidthToDeflateBy);
            this.drawPathAsLineOrMesh(clipperFirstPath, opts.width, opts.isShowAsMesh, this.solderMaskGrp);
                            
            // push this line onto gcode array
            this.solderMaskGcodePath.push(clipperFirstPath);
            
            // var threeFirstPath = this.drawClipperPaths(clipperFirstPath, 0xff0000, 0.9, 1);
            // this.sceneRemove(threeFirstPath);
            // this.solderMaskGrp.add(threeFirstPath);
            
            // now, keep deflating by width of of laser / end mill until no paths are left
            // but take into account the overlap
            var isStillAPath = true;
            var lastReducePath = clipperFirstPath;
            while (isStillAPath) {
            
                var deflateBy = opts.width * (1 - opts.overlapPct / 100) * -1;
                var clipperReducePath = this.getInflatePath(lastReducePath, deflateBy);
                
                if (clipperReducePath.length > 0) {
                    // we have paths after the reduce. draw it.
                    this.drawPathAsLineOrMesh(clipperReducePath, opts.width, opts.isShowAsMesh, this.solderMaskGrp);
                            
                    // push this line onto gcode array
                    this.solderMaskGcodePath.push(clipperReducePath);
                    
                    // var threeReducePath = this.drawClipperPaths(clipperReducePath, 0xff0000, 0.9, 1);
                    // this.sceneRemove(threeReducePath);
                    // this.solderMaskGrp.add(threeReducePath);
                    
                    lastReducePath = clipperReducePath;
                } else {
                    isStillAPath = false;
                }
            }
            
            // if double trace on pads, then do it
            if (isDblTrace) {
                // do additional path deflated at start value
                this.drawPathAsLineOrMesh(clipperFirstPath, opts.width, opts.isShowAsMesh, this.solderMaskGrp);
                            
                // push this line onto gcode array
                this.solderMaskGcodePath.push(clipperFirstPath);
            }
            

            // ok, now add our group
            this.sceneAdd(this.solderMaskGrp);
            
            $('.com-chilipeppr-widget-eagle-infoTemp')
                .addClass("hidden");
                
            // might as well generate gcode
            this.solderMaskGenerateGcode();
        },
        solderMaskGenerateGcodeTimeoutPtr: null,
        solderMaskIsGcodeInRegeneratingState: false,
        /**
         * This method will trigger a process to generateGcode however, it
         * allows this to be called a bunch of times and it will always wait
         * to do the generate about 1 second later and de-dupe the multiple calls.
         */
        solderMaskGenerateGcode: function() {
            // this may be an odd place to trigger gcode change, but this method
            // is called on all scaling changes, so do it here for now
            if (this.solderMaskGenerateGcodeTimeoutPtr) {
                //console.log("clearing last setTimeout for generating gcode cuz don't need anymore");
                clearTimeout(this.solderMaskGenerateGcodeTimeoutPtr);
            }
            if (!this.solderMaskIsGcodeInRegeneratingState) {
                $('#' + this.id + " .eagle-soldermask-gcode").prop('disabled', true);
                $('#' + this.id + " .btn-eagle-soldermask-sendgcodetows").prop('disabled', true);
                
                $('#' + this.id + " .eagle-soldermask-regenerate").removeClass('hidden');
                $('#' + this.id + " .eagle-soldermask-gcode-size-span").addClass('hidden');
                // set this to true so next time we are called fast we know we don't have
                // to set the UI elements again. they'll get set back and this flag after
                // the gcode is generated
                this.solderMaskIsGcodeInRegeneratingState = true;
                
                $('.com-chilipeppr-widget-eagle-infoTemp')
                    .html("Generating Gcode...")
                    .removeClass("hidden");

            } else {
                // do nothing
                //console.log("already indicated in UI we have to regenerate");
            }
            this.solderMaskGenerateGcodeTimeoutPtr = setTimeout(this.solderMaskGenerateGcodeCallback.bind(this), 1000);
         },
        /**
         * Iterate over the text3d that was generated and create
         * Gcode to mill/cut the three.js object.
         */
        solderMaskGenerateGcodeCallback: function() {
            
            console.log("solderMaskGenerateGcodeCallback. path:", this.solderMaskGcodePath);
            
            // get settings
            // get user width of laser or end mill
            var w = 0.1; // mm
            w = $('.com-chilipeppr-widget-soldermask-laser-width').val();
            
            // get user overlap of path
            var overlapPct = 20; // mm
            overlapPct = $('.com-chilipeppr-widget-soldermask-laser-overlap').val();
            
            var options = {};
            options["mode"] = $('#' + this.id + ' input[name=com-chilipeppr-widget-eagle-soldermask-mode]:checked').val();
            options["laseron"] = $('#' + this.id + ' input[name=com-chilipeppr-widget-eagle-soldermask-laseron]:checked').val();
            options["lasersvalue"] = $('#' + this.id + ' .eagle-soldermask-input-svalue').val();
            options["cayennon"] = $('#' + this.id + ' .eagle-soldermask-input-cayenn-on').val();
            options["cayennoff"] = $('#' + this.id + ' .eagle-soldermask-input-cayenn-off').val();
            options["cayennpre"] = $('#' + this.id + ' .eagle-soldermask-input-cayenn-pre').val();
            options["cayennpost"] = $('#' + this.id + ' .eagle-soldermask-input-cayenn-post').val();
            options["millclearanceheight"] = parseFloat($('#' + this.id + ' .eagle-soldermask-input-clearance').val());
            options["milldepthcut"] = parseFloat($('#' + this.id + ' .eagle-soldermask-input-depthcut').val());
            options["millfeedrateplunge"] = $('#' + this.id + ' .eagle-soldermask-input-feedrateplunge').val();
            options["feedrate"] = $('#' + this.id + ' .eagle-soldermask-input-feedrate').val();
            options["clearance"] = $('#' + this.id + ' .eagle-soldermask-input-clearance').val();
            options["spindle"] = $('#' + this.id + ' .eagle-soldermask-input-spindle').val();
            var isOutlineOnly = $('.com-chilipeppr-widget-eagle-soldermask-outline').is(":checked");
            var outlineOut, outlineOn, outlineIn;
            if (isOutlineOnly) {
                outlineOut = $('.com-chilipeppr-widget-eagle-soldermask-outlineOutside').is(":checked");
                outlineOn = $('.com-chilipeppr-widget-eagle-soldermask-outlineOn').is(":checked");
                outlineIn = $('.com-chilipeppr-widget-eagle-soldermask-outlineInside').is(":checked");
            }
            var isIncludeDimensions = $('.com-chilipeppr-widget-eagle-soldermask-outlineDimensions').is(":checked");
            
            var isInvert = $('.com-chilipeppr-widget-eagle-soldermask-invert').is(":checked");
            var isDblTrace = $('.com-chilipeppr-widget-eagle-soldermask-invert-dbltrace').is(":checked");
            var isTraceOutside = $('.com-chilipeppr-widget-eagle-soldermask-invertOutside').is(":checked");
            var isTraceOn = $('.com-chilipeppr-widget-eagle-soldermask-invertOn').is(":checked");
            var isTraceInside = $('.com-chilipeppr-widget-eagle-soldermask-invertInside').is(":checked");
            
            
            // test cayenn cmds
            if (options.laseron == "cayenn") {
                try {
                    eval("var objOn = " + options.cayennon);
                    // objOn = {Cayenn:objOn}
                    options.cayennon = JSON.stringify(objOn);
                } catch (e) {
                    chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Error Parsing Your Cayenn Command", "We got an error parsing your Cayenn On Command. " + options.cayennon);
                }
                try {
                    eval("var objOff = " + options.cayennoff);
                    // objOff = {Cayenn:objOff}
                    options.cayennoff = JSON.stringify(objOff);
                } catch (e) {
                    chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Error Parsing Your Cayenn Command", "We got an error parsing your Cayenn Off Command. " + options.cayennoff);
                }
                try {
                    eval("var obj = " + options.cayennpre);
                    options.cayennpre = JSON.stringify(obj);
                } catch (e) {
                    chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Error Parsing Your Cayenn Command", "We got an error parsing your Cayenn Pre-Run Command. " + options.cayennpre);
                }
                try {
                    eval("var obj = " + options.cayennpost);
                    options.cayennpost = JSON.stringify(obj);
                } catch (e) {
                    chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Error Parsing Your Cayenn Command", "We got an error parsing your Cayenn Post-Run Command. " + options.cayennpost);
                }
            }
            
            var g = "(Gcode generated by ChiliPeppr)\n(Eagle BRD Solder Mask Widget)\n";
            g += "(" + new Date().toLocaleString() + ")\n";
            if (isOutlineOnly) {
                g += "(Cutting outline of pads/smds)\n";
                if (outlineOut) g += "(Cutting outside pad/smd)\n";
                if (outlineOn) g += "(Cutting on pad/smd path)\n";
                if (outlineIn) g += "(Cutting inside pad/smd path)\n";
            } else if (isInvert) {
                g += "(Inverted paths)\n";
                if (isTraceOutside) g += "(Path start outside pads)\n";
                if (isTraceOn) g += "(Path start on pad outline)\n";
                if (isTraceInside) g += "(Path start inside pads)\n";
            } else {
                g += "(Cutting full pads/smds)\n";
            }
            g += "(Mode: " + options.mode + ")\n";
            if (options.mode == "laser") {
                if (options.laseron == "M7")
                    g += "(Laser turn on method: M8)\n";
                else
                    g += "(Laser turn on method: " + options.laseron + ")\n";
                if (options.laseron == "cayenn") {
                    g += "(Cayenn on cmd: " + options.cayennon + ")\n";
                    g += "(Cayenn off cmd: " + options.cayennoff + ")\n";
                }
            }
            g += "(Width of cut: " + w + ")\n";
            g += "G21 (mm)\n";
            g += "M9 (make sure coolant is off)\n";
            
            if (options.mode == "mill") {
                // move to clearance
                g += "G0 Z" + options.clearance + " (move to clearance)";
                // turn on spindle
                g += "M3 S" + options.spindle + "\n";
            } else if (options.mode == "laser" && options.laseron == "cayenn") {
                // put the pre-run cmd at start of file
                g += "(" + options.cayennpre + ")\n";
            }
            
            var that = this;
            var isLaserOn = false;
            var isAtClearanceHeight = false;
            var isFeedrateSpecifiedAlready = false;
            var isAtNewPad = true;
            
            var padCtr = 0;
            
            for (var i = 0; i < this.solderMaskGcodePath.length; i++) {
                var path = this.solderMaskGcodePath[i];
                
                console.log("path:", path);
                
                if (typeof path == "string" && path.match(/safe height/)) {
                    // move to safe height
                    
                } else if (typeof path == "string" && path.match(/move to/)) {
                    
                    console.log("in move to");
                    padCtr++;
                    if (path.match(/dimension/)) {
                        g += "(Dimension path)\n";
                    } else {
                        g += "(Pad/smd " + padCtr + ")\n";
                    }

                    // save boolean that we're at first pad so next move is G0
                    isAtNewPad = true;

                    // turn off laser
                    // see if laser or milling
                    if (options.mode == "laser") {
                        // turn off laser for move
                        isLaserOn = false;
                        if (options.laseron == "M3")
                            g += "M5 (laser off)\n";
                        else if (options.laseron == "M7")
                            g += "M9 (laser off)\n";
                        else
                            g += "(" + options.cayennoff + ")\n";
                            
                        // move to a clearance height
                        // g += "G0 Z2\n";
                        // isAtClearanceHeight = true;
                        
                    } else {
                        // milling. move back to clearance height
                        g += "G0 Z" + options.millclearanceheight + "\n";
                        isAtClearanceHeight = true;
                    }
                } else {
                    // we have coordinates to move
                    // make sure only one path
                    if (path.length > 1) {
                        
                        // we are probably milling the invert path
                        if (isInvert) {
                            // we are ok then, but need to do all paths
                        } else {
                            // we are milling normal path, and i don't think we should
                            // get multiple paths so show error in case i missed something
                            console.error("we have more than one path, should not happen. path:", path);
                        }
                    }
                    
                    // in normal milling we should have just one path, but since
                    // we added the invert option we get multiple paths now
                    for (var pathIndex = 0; pathIndex < path.length; pathIndex++) {
                        var p = path[pathIndex];
                    
                        // var p = path[0];
                    
                        // see if is move to first position
                        if (isAtNewPad) {
                            // it is, so make G0 fast move
                            g += "G0 ";
                            isAtNewPad = false;
                        } else {
                            // it is not at new smd, it's inside an smd so just do g1
                            g += "G1 ";
                        }
                        
                        g += "X" + p[0].X.toFixed(3) + " Y" + p[0].Y.toFixed(3) + "\n"; // + " (1st pos)\n";
                        
                        // turn on laser
                        // see if laser or milling
                        if (options.mode == "laser") {
                            
                            // if the laser is not on, we need to turn it on
                            if (!isLaserOn) {
                                if (options.laseron == "M3") {
                                    g += "M3 S" + options.lasersvalue + " (laser on)\n";
                                } else if (options.laseron == "M7") {
                                    g += "M8 (coolant on / laser on)\n";
                                } else {
                                    // cayenn
                                    g += "(" + options.cayennon + ")\n";
                                }
                                
                                isLaserOn = true;
                            }
                        } else {
                            // this is milling. if we are not at depth cut
                            // we need to get there
                            g += "G1 Z" + options.milldepthcut + " F" + options.millfeedrateplunge + "\n";
                            isAtClearanceHeight = false;
                            
                        }
                        
                        // now that spindle or laser is on, start moves after 1st position
                        for (var i2 = 1; i2 < p.length; i2++) {
                            var pt = p[i2];
                            
                            // see if feedrate specificed
                            if (!isFeedrateSpecifiedAlready) {
                                g += "F" + options.feedrate + " (Feedrate for cut)\n";
                                isFeedrateSpecifiedAlready = true;
                            }
                            
                            g += "G1 X" + pt.X.toFixed(3) + " Y" + pt.Y.toFixed(3) + "\n";
                        }
                        // we have to move back to first pt to complete the drawing
                        var pt = p[0];
                        g += "G1 X" + pt.X.toFixed(3) + " Y" + pt.Y.toFixed(3) + "\n";

                    }
                    
                }
            }          
            
            // turn off laser or spindle
            // see if laser or milling
            if (options.mode == "laser") {
                // turn off laser for move
                isLaserOn = false;
                if (options.laseron == "M3")
                    g += "M5 (laser off)\n";
                else if (options.laseron == "M7")
                    g += "M9 (laser off)\n";
                else {
                    g += "(" + options.cayennoff + ")\n";
                    
                    // put the post-run cmd at end of file
                    g += "(" + options.cayennpost + ")\n";
                }
            } else {
                // milling. move back to clearance height
                g += "G0 Z" + options.millclearanceheight + "\n";
                isAtClearanceHeight = true;
                // turn off spindle
                g += "M5 (spindle off)\n";
            }
            g += "(Done)\n";
            
            console.log("generated gcode. length:", g.length);
            //console.log("gcode:", g);
            $('#' + this.id + " .eagle-soldermask-gcode").val(g).prop('disabled', false);
            $('#' + this.id + " .btn-eagle-soldermask-sendgcodetows").prop('disabled', false);
            $('#' + this.id + " .eagle-soldermask-regenerate").addClass('hidden');
            $('#' + this.id + " .eagle-soldermask-gcode-size-span").removeClass('hidden');
            $('#' + this.id + " .eagle-soldermask-gcode-size").text(parseInt(g.length / 1024) + "KB");

            $('.com-chilipeppr-widget-eagle-infoTemp')
                .addClass("hidden");
                
            this.solderMaskIsGcodeInRegeneratingState = false;

        },
        solderMaskSendGcodeToWorkspace: function() {
            
            var info = {
                name: "Eagle Solder Mask: " + this.fileInfo.name.replace(/.brd$/i, ""), 
                lastModified: new Date()
            };
            // grab gcode from textarea
            var gcodetxt = $('.eagle-soldermask-gcode').val();
            
            if (gcodetxt.length < 10) {
                chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Error Sending Gcode", "It looks like you don't have any Gcode to send to the workspace. Huh?", 5 * 1000);
                return;
            }
            
            // send event off as if the file was drag/dropped
            chilipeppr.publish("/com-chilipeppr-elem-dragdrop/ondropped", gcodetxt, info);
            
            chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Sent Gcode to Workspace", "Sent your solder mask Gcode to the workscape. Close the Eagle widget to see it.");
            
            var that = this;
            this.get3dObj(function() {
                console.log("got callback after 3dviewer re-sent us the 3dobj and 3dobjmeta. 3dobj:", that.obj3d, "obj3dmeta:", that.obj3dmeta);
                that.sceneReAddMySceneGroup();
            });
        },
        /**
         * Pass in a clipper path and we will draw the line or inflate the line to a nice looking mesh.
         * This is used to draw end mill paths that are the width of the line.
         */
        drawPathAsLineOrMesh: function(clipperPath, width, isShowAsMesh, threeGroup) {
            var pathGrp = this.drawClipperPaths(clipperPath, 0xff0000, 0.5, 0.025); //, 0.1);
            // drawClipperPaths shoves into the scene. we'll remove so we can add it to our overall group
            this.sceneRemove(pathGrp);
            if (!isShowAsMesh) 
                threeGroup.add(pathGrp);
            
            if (isShowAsMesh) {    
                var lineMesh = this.getMeshLineFromClipperPath({
                    width: width, 
                    clipperPath: clipperPath, 
                    isSolid: true,
                    opacity: 0.4,
                    isShowOutline: false,
                    color: 0xff0000,
                });
                lineMesh.position.setZ(0.025);
                threeGroup.add(lineMesh);
            }
        },
        getCentroid: function ( mesh ) {

            // if(mesh.geometry === undefined)
            //     return { x : 0, y : 0, z : 0 };
            mesh.geometry.computeBoundingBox();
            var boundingBox = mesh.geometry.boundingBox;
            console.log("boundingBox:", boundingBox);
        
            var x0 = boundingBox.min.x;
            var x1 = boundingBox.max.x;
            var y0 = boundingBox.min.y;
            var y1 = boundingBox.max.y;
            var z0 = boundingBox.min.z;
            var z1 = boundingBox.max.z;
        
        
            var bWidth = ( x0 > x1 ) ? x0 - x1 : x1 - x0;
            var bHeight = ( y0 > y1 ) ? y0 - y1 : y1 - y0;
            var bDepth = ( z0 > z1 ) ? z0 - z1 : z1 - z0;
        
            var centroidX = x0 + ( bWidth / 2 ) + mesh.position.x;
            var centroidY = y0 + ( bHeight / 2 )+ mesh.position.y;
            var centroidZ = z0 + ( bDepth / 2 ) + mesh.position.z;
        
            return { x : centroidX, y : centroidY, z : centroidZ };
        
        },
        
        mirrorX: false,
        mirrorY: false,
        //V5.1D20161229 - Added
        setupMirrorAxis: function() {
            $("#com-chilipeppr-widget-eagle .mirrorAxisX").change(this.onChangeMirrorAxis.bind(this));
            $("#com-chilipeppr-widget-eagle .mirrorAxisY").change(this.onChangeMirrorAxis.bind(this));
            $('#com-chilipeppr-widget-eagle .mirrorAxisX').prop ("checked", false);
            $('#com-chilipeppr-widget-eagle .mirrorAxisY').prop ("checked", false);
        },
        //V5.1D20161229 - Added
        onChangeMirrorAxis: function() {
            this.mirrorX = $('#com-chilipeppr-widget-eagle .mirrorAxisX').prop ("checked");
            this.mirrorY = $('#com-chilipeppr-widget-eagle .mirrorAxisY').prop ("checked");
            //this.clearEagleBrd();
            //this.draw3d();
        },
        
        tabs:{
            useTabs: true,
            distance: 25,
            width: 2,
            height: 0.8,
            useForSlots: false
        },
        setupTabParameters: function() {
            $("#com-chilipeppr-widget-eagle .use-tabs").change(this.onChangeTabParameter.bind(this));
            $("#com-chilipeppr-widget-eagle .tab-distance").change(this.onChangeTabParameter.bind(this));
            $("#com-chilipeppr-widget-eagle .tab-width").change(this.onChangeTabWidth.bind(this));
            $("#com-chilipeppr-widget-eagle .tab-height").change(this.onChangeTabHeight.bind(this));
            $("#com-chilipeppr-widget-eagle .tabs-4-slots").change(this.onChangeTabParameter.bind(this));
            $("#com-chilipeppr-widget-eagle .use-tabs").prop("checked", this.tabs.useTabs);
            $("#com-chilipeppr-widget-eagle .tab-distance").val(this.tabs.distance);
            $("#com-chilipeppr-widget-eagle .tab-width").val(this.tabs.width);
            $("#com-chilipeppr-widget-eagle .tab-height").val(this.tabs.height);
            $("#com-chilipeppr-widget-eagle .tabs-4-slots").prop("checked", this.tabs.useForSlots);
        },
        onChangeTabWidth: function(){
            var item = $("#com-chilipeppr-widget-eagle .tab-width");
            if (item.val() == "") {item.val(this.tabs.width); return;}
            var tw = parseFloat(item.val());
            if (tw > 3.0) {tw = 3.0; item.val("3.0");}
            if (tw < 0.5) {tw = 0.5; item.val("0.5");}
            this.tabs.width = tw;
        },
        onChangeTabHeight: function(){
            var item = $("#com-chilipeppr-widget-eagle .tab-height");
            if (item.val() == "") {item.val(this.tabs.height); return;}
            var dd = -this.depthOfDimensions;
            var th = parseFloat(item.val());
            if (th > dd) {th = dd; item.val(dd);}
            if (th < 0.5) {th = 0.5; item.val("0.5");}
            this.tabs.height = th;
        },
        onChangeTabParameter: function(){
            this.tabs.useTabs = $("#com-chilipeppr-widget-eagle .use-tabs").prop("checked");
            this.tabs.distance = parseFloat($("#com-chilipeppr-widget-eagle .tab-distance").val());
            this.tabs.useForSlots = $("#com-chilipeppr-widget-eagle .tabs-4-slots").prop("checked");
        },
        setupLayerToggleDropdown: function() {
        	$('#com-chilipeppr-widget-eagle .selectLayer').change(this.onChangeLayerToggleDropdown.bind(this));
          //console.log("r0:  ");
        },
        populateLayerToggleDropdown: function() {
            var selectLayerDropdown = $('#com-chilipeppr-widget-eagle .selectLayer');
            var actionableLayers = [];
            //var allSignals = Object.keys(this.eagle.signalItems);
            var allSignals = this.eagle.signalItems;
            console.log("allSignals:  ", allSignals);
            //alert(allSignals[0]);

            for (var signalKey in this.eagle.signalItems) {
                var signalLayers = this.eagle.signalItems[signalKey];
                var sigKey = Object.keys(signalLayers);

                for (var i = 0; i < sigKey.length; i++) {
                    var sigKeyAsInt = sigKey[i];
                    console.log("r2:  ", signalLayers, "keys:", sigKey, "int:  ", sigKeyAsInt);
                    if (sigKeyAsInt > 0 && sigKeyAsInt <= 16) { //brd layer is 1-16
                        actionableLayers[sigKeyAsInt - 1] = true; //-1 for array index
                        console.log("layer true:  ", sigKeyAsInt);
                    }
                    else {
                        actionableLayers[sigKeyAsInt - 1] = false;
                        console.log("layer false:  ", sigKeyAsInt);
                    }
                }
            } //this function returns the layer # of each signal!!!
            for (var elemKey in this.eagle.elements) {
                var elem = this.eagle.elements[elemKey];
                if(elem.mirror)//unmirrored elements are on top layer (index 0), mirrored elements are on bottom layer (index 15)
                    actionableLayers[0] = true;
                else
                    actionableLayers[15] = true;
            }
            selectLayerDropdown.empty();
            for (i = 0; i < 16; i++) {
                var loopingLayer = i + 1; //brd layer # is 1 greater than index
                if (actionableLayers[i] == true || i == 0 || i == 15) {
                    selectLayerDropdown.append($("<option />").text(this.eagle.layersByNumber[loopingLayer].name));

                    console.log("r3:  sent layer to dropdown:", this.eagle.layersByNumber[loopingLayer].name);
                }
                console.log("r3.5:  activeLayer:", this.activeLayer);

            }
            selectLayerDropdown.val(this.activeLayer);

        },
        onChangeLayerToggleDropdown: function() {
            
            var that = this;

            var selectedLayerInDropdown = $("#com-chilipeppr-widget-eagle .selectLayer :selected").text();
            //var activeLayer = this.layer.name;
            //console.log("r4.9:  ", this.layer.name);
            console.log("selected layer in dropdown:  ", selectedLayerInDropdown);
            /*console.log("r6:  ", activeLayer);
            if (selectedLayerInDropdown != activeLayer) {
            	console.log("r7:  Different");
            }*/
            var oldActiveLayer = this.activeLayer;
            if (selectedLayerInDropdown != oldActiveLayer) {
                this.activeLayer = selectedLayerInDropdown;
                console.log("layer active now:  ", this.activeLayer);
                //debugger;
                //this.draw3dSignalWires [this.activeLayer];

                var layerName = this.activeLayer;
                if (layerName == "Top") {
                    //console.log("RAY!!! 3dSignalWireLayerName: T.  ", layerName)
                    that.colorSignal = 9249571;
                    that.colorSmd = 9249571;
                }
                else if (layerName == "Bottom") {
                    //console.log("RAY!!! 3dSignalWireLayerName: B.  ", layerName)
                    that.colorSignal = 2302861;
                    that.colorSmd = 2302861;
                    //console.log("RAY!!! Bottom Color:  ", tempColor)
                }
                else {
                    that.colorSignal = 11403055;
                    that.colorSmd = 11403055;
                }
                
                // $('#com-chilipeppr-widget-eagle .mirrorLayerY').prop ("checked", false);
                // this.flipTheBoard = false;

                this.clearEagleBrd();
                this.draw3d();
                //this.onRefresh();
          }
          //console.log("r5.5:  active before", oldActiveLayer);
          //this.activeLayer=selectedLayerInDropdown;
          //console.log("r6:  active now", this.activeLayer);
          //console.log("r7:  layer.name", this.layer.name);
          //this.onRefresh();
          
        /*
        	var selectLayerDropdown = $('#com-chilipeppr-widget-eagle .selectLayer');
          //var activeLayer= 'Top';  //Set as property around line 610, ignore this
          selectLayerDropdown.change(function(){  //Just onchange for now
          //$('#dropDownId :selected').text();	//Still need to write this jq to get dropdown selected text
          	this.activeLayer = 'Bottom';			//Will set to selected contents of dropdown
            console.log("r4:  ActiveLayer:  ", this.activeLayer); 	//this gets logged successfully
          	this.onRefresh();				//console says this is not a function.				
            
          });
          */
        },
        // flipTheBoard: false, //ray temporary hardcode, later bind to user input
        //placeholder, also need to hold which direction to flip board in.  coming soon.
        //boardFlipAxis: null,
        
        //defining Three features we frequently utilize.  No need to redefine constantly.  
        
        ThreeAxisX: null,
        ThreeAxisY: null,
        ThreeAxisZ: null,
        
        deg180toRad: null,
        
        //function to setup these properties.  Call this during init.
        setupFrequentThreeFeatures: function () {
            
            if (!this.ThreeAxisX)
                this. ThreeAxisX = new THREE.Vector3(1, 0, 0);
                
            if (!this.ThreeAxisY)
                this. ThreeAxisY = new THREE.Vector3(0, 1, 0);
                
            if (!this.ThreeAxisZ)
                this. ThreeAxisZ = new THREE.Vector3(0, 0, 1);
                
            
            if (!this.deg180toRad)
                this. deg180toRad = (Math.PI / 180) * 180;
            
            if (!this.boardFlipAxis)
                this. boardFlipAxis = this.ThreeAxisY;
        },
        
        setupFeedsDepths: function() {
            // As user changes vals, just update our global props
            var el = $('#com-chilipeppr-widget-eagle');
            var that = this;
            el.find('.spindle-rpm').change(function(evt) {
                console.log("evt:", evt);
                that.spindleRPM = evt.currentTarget.valueAsNumber;
            });
            el.find('.trace-depth').change(function(evt) {
                console.log("evt:", evt);
                that.depthOfSignalMilling = evt.currentTarget.valueAsNumber;
                console.log("that.depthOfSignalMilling:", that.depthOfSignalMilling);
            });
            el.find('.trace-fr').change(function(evt) {
                console.log("evt:", evt);
                that.feedRateSignals = evt.currentTarget.valueAsNumber;
            });
            el.find('.trace-fr-plunge').change(function(evt) {
                console.log("evt:", evt);
                that.feedRatePlunge = evt.currentTarget.valueAsNumber;
            });
            el.find('.clearance-height').change(function(evt) {
                console.log("evt:", evt);
                that.clearanceHeight = evt.currentTarget.valueAsNumber;
            });
            el.find('.drill-useboarddepth').change(function(evt) {
                console.log("evt:", evt);
                var elem = $('#com-chilipeppr-widget-eagle .drill-depth');
                if(elem.prop('disabled')){
                    elem.prop('disabled', false);
                    elem.val(that.drillDepth);
                }else{
                    elem.prop('disabled', true);
                    elem.val(that.depthOfDimensions);
                    that.drillDepth = elem.val();
                }
            });
            el.find('.drill-feedrate').change(function(evt) {
                console.log("evt:", evt);
                if(evt.currentTarget.valueAsNumber) // arrow buttons send 2 events
                  that.drillFeedrate = evt.currentTarget.valueAsNumber;
            });
            el.find('.drill-max').change(function(evt) {
                console.log("evt:", evt);
                if(evt.currentTarget.valueAsNumber) // arrow buttons send 2 events
                  that.drillMaxDiameter = evt.currentTarget.valueAsNumber;
            });
            el.find('.drill-depth').change(function(evt) {
                console.log("evt:", evt);
                if(evt.currentTarget.valueAsNumber) // arrow buttons send 2 events
                  that.drillDepth = evt.currentTarget.valueAsNumber;
            });
            el.find('.dimension-layer-20').change(function(evt) {
                that.useDimensionLayer = evt.currentTarget.checked;
            });
            el.find('.dimension-layer-46').change(function(evt) {
                that.useMillingLayer = evt.currentTarget.checked;
            });
            el.find('.com-chilipeppr-widget-eagle-dimension-tso-wireWidth').change(function(evt) {
                that.cuttingToolOption = evt.currentTarget.checked?0:1;
            });
            el.find('.com-chilipeppr-widget-eagle-dimension-tso-oneTool').change(function(evt) {
                that.cuttingToolOption = evt.currentTarget.checked?1:0;
            });
            el.find('.dimension-minimum-wire-width').change(function(evt) {
                var item = $(evt.currentTarget);
                var d = parseFloat(item.val());
                if (d <= 0) {
                    d = that.minWireWidthToMill;
                    item.val(d);
                }
                else
                    that.minWireWidthToMill = d;
            });
            el.find('.dimension-ignore-small-wires').change(function(evt) {
                that.ignoreSmallWires = evt.currentTarget.checked;
            });
            el.find('.dimension-mill-diameter').change(function(evt) {
                console.log("evt:", evt);
                /* 
                TODO: 
                - Test to exists holes they are smaller as this mill diameter and 
                Compare that.drillMaxDiameter greater as this holes or alert!
                Cuz i.e.
                The user has 1mm and 1.5mm holes, the user settings are:
                  * that.drillMaxDiameter = 1.1
                  * that.millDiameter = 2
                then it's impossible to mill 1.5mm holes with a 2mm tool.
                Send user a message and prevent a change here
                */
                var choosedDiameter = evt.currentTarget.valueAsNumber;
                for ( var diameter in that.sortObjByKey(that.holesToDrill) ){////V5.2D20170105 replaced drillPads with holesToDrill
                  if(diameter > that.drillMaxDiameter && diameter < choosedDiameter){
                     evt.currentTarget.style.color = "#ff0000";
                     chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", 
                           "Warning", 
                           "The choosed mill diameter " + choosedDiameter + "mm are to small to mill holes with " 
                              + diameter + "mm! Please check you drill max diameter!" , 
                        3 * 1000);
                      return;
                  } else {
                      evt.currentTarget.style.color = ""
                  }
                }

                if(evt.currentTarget.valueAsNumber) // arrow buttons send 2 events
                  that.millDiameter = evt.currentTarget.valueAsNumber;
            });
            el.find('.dimension-depth').keyup(function(evt) {
                console.log("evt:", evt);
                var item = $(evt.currentTarget);
                that.depthOfDimensions = parseFloat(item.val());
                console.log("depthOfDimensions:", that.depthOfDimensions);
                if (that.depthOfDimensions > 0) {
                    that.depthOfDimensions = that.depthOfDimensions * -1;
                    item.val(that.depthOfDimensions);
                }
                that.calcPasses(el);
                that.onChangeTabHeight();
            });
            el.find('.dimension-stepdown').keyup(function(evt) {
                console.log("evt:", evt);
                var item = $(evt.currentTarget);
                that.stepDownDimensions = parseFloat(item.val());
                if (isNaN(that.stepDownDimensions)) {
                    item.addClass("alert-danger");
                    return;
                }
                item.removeClass('alert-danger');
                if (that.stepDownDimensions > 0) {
                    that.stepDownDimensions = that.stepDownDimensions * -1;
                    item.val(that.stepDownDimensions);
                }
                if (that.stepDownDimensions < that.depthOfDimensions) {
                    // they can't make their step down be greater than dimensions
                    that.stepDownDimensions = that.depthOfDimensions;
                    item.val(that.stepDownDimensions);
                }
                that.calcPasses(el);
            });
            el.find('.dimension-feedrate').change(function(evt) {
                console.log("evt:", evt);
                that.feedRateDimensions = evt.currentTarget.valueAsNumber;
            });
            el.find('.pcbholder-length').change(function(evt) {
                console.log("evt:", evt);
                that.PCBHolderLength = evt.currentTarget.valueAsNumber;
            });
            el.find('.pcbholder-count').change(function(evt) {
                console.log("evt:", evt);
                that.PCBHolderCount = evt.currentTarget.valueAsNumber;
            });
            
            el.find('.dispenser-axis').change(function(evt) {
                console.log("evt:", evt);
                that.dispenserAxis = evt.currentTarget.valueAsNumber;
            });
            el.find('.stepsfordrop').change(function(evt) {
                console.log("evt:", evt);
                that.stepsfordrop = evt.currentTarget.valueAsNumber;
            });
            el.find('.cannula-diameter').change(function(evt) {
                console.log("evt:", evt);
                that.cannulaDiameter = evt.currentTarget.valueAsNumber;
            });
            el.find('input').trigger('change');
        },
        calcPasses: function(el) {
            // calc passes
            var passesFloat = this.depthOfDimensions / this.stepDownDimensions;
            var passes = parseInt(passesFloat);
            passesFloat -= passes;
            if (passesFloat > 0) passes++;
            el.find('.dimension-passes i').text(passes);
            var lastPass = this.depthOfDimensions - ((passes - 1) * this.stepDownDimensions);
            //if (lastPass == 0) lastPass = that.stepDownDimensions;
            el.find('.dimension-lastpass i').text(lastPass.toFixed(2));
            console.log("passes:", passes, "lastPass:", lastPass, "passesFloat:", passesFloat);
        },
        /**
         * This method is called from the main workspace telling us the user
         * just activated us as a widget. This is not the same as load. Load
         * happens once. Activate happens many times if user closes then opens
         * us.
         */
        activateWidget: function() {
            console.log("activating Eagle BRD widget");
            this.reactivateMouseMove();
            this.sceneReAddMySceneGroup();
        },
        unactivateWidget: function() {
            console.log("unactivating Eagle BRD widget");
            this.sceneRemoveMySceneGroup();
            this.deactivateMouseMove();
            // hide solder mask as well
            setTimeout(this.solderMaskRenderHide.bind(this), 10);
        },
        /**
         * Try to get a reference to the 3D viewer.
         */
        init3d: function () {
            this.get3dObj();
            if (this.obj3d == null) {
                console.log("loading 3d scene failed, try again in 1 second");
                var attempts = 1;
                var that = this;
                setTimeout(function () {
                    that.get3dObj();
                    if (that.obj3d == null) {
                        attempts++;
                        setTimeout(function () {
                            that.get3dObj();
                            if (that.obj3d == null) {
                                console.log("giving up on trying to get 3d");
                            } else {
                                console.log("succeeded on getting 3d after attempts:", attempts);
                                that.onInit3dSuccess();
                            }
                        }, 5000);
                    } else {
                        console.log("succeeded on getting 3d after attempts:", attempts);
                        that.onInit3dSuccess();
                    }
                }, 1000);
            } else {
                this.onInit3dSuccess();
            }

        },
        onInit3dSuccess: function () {
            console.log("onInit3dSuccess. That means we finally got an object back.");
            this.clear3dViewer();
            // open the last file
            var that = this;
            //setTimeout(function () {
                that.open();
            //}, 1000);
        },
        obj3d: null, // gets the 3dviewer obj stored in here on callback
        obj3dmeta: null, // gets metadata for 3dviewer
        userCallbackForGet3dObj: null,
        get3dObj: function (callback) {
            this.userCallbackForGet3dObj = callback;
            chilipeppr.subscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this, this.get3dObjCallback);
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/request3dObject", "");
            chilipeppr.unsubscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this.get3dObjCallback);
        },
        get3dObjCallback: function (data, meta) {
            console.log("got 3d obj:", data, meta);
            this.obj3d = data;
            this.obj3dmeta = meta;
            if (this.userCallbackForGet3dObj) {
                //setTimeout(this.userCallbackForGet3dObj.bind(this), 200);
                //console.log("going to call callback after getting back the new 3dobj. this.userCallbackForGet3dObj:", this.userCallbackForGet3dObj);
                this.userCallbackForGet3dObj();
                this.userCallbackForGet3dObj = null;
            }
        },
        is3dViewerReady: false,
        clear3dViewer: function () {
            console.log("clearing 3d viewer");
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneclear");
            //if (this.obj3d) this.obj3d.children = [];            
            /*
            this.obj3d.children.forEach(function(obj3d) {
                chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneremove", obj3d);
            });
            */
            this.is3dViewerReady = true;
        },
        clearEagleBrd: function() {
            this.get3dObj(this.clearEagleBrdStep2.bind(this));
        },
        clearEagleBrdStep2: function() {
            console.log("clearing Eagle BRD. this.obj3d:", this.obj3d, "this.mySceneGroup:", this.mySceneGroup);
            // remove all 3d viewer stuff
            this.sceneRemoveMySceneGroup();
            this.mySceneGroup = null;
            console.log("after clearing Eagle BRD. this.obj3d:", this.obj3d, "this.mySceneGroup:", this.mySceneGroup);
            
            
            //this.sceneRemove(this.threeDimensions);
            
            //this.threeDimensions = null;

            // contains the end mill path (blue/gray line)
            /*this.threePathEndMill.forEach(function(threeObj) {
                this.sceneRemove(threeObj);
            }, this);*/
            this.threePathEndMill = [];
            
            // contains the mesh signals (wires/pads/smds/vias)
            /*this.threePathEndMillArr.forEach(function(p) {
                this.sceneRemove(p);
            }, this);
            this.threePathDeflatedActualArr.forEach(function(p) {
                this.sceneRemove(p);
            }, this);
            this.threePathInflatedActualArr.forEach(function(p) {
                this.sceneRemove(p);
            }, this);*/
            
            // now reset arrays since they're useless now that
            // we removed them and will regenerate below
            this.threePathEndMillArr = [];
            this.threePathDeflatedActualArr = [];
            this.threePathInflatedActualArr = [];
            this.pathEndMillArr = [];
            this.pathEndMillHolesArr = [];
            this.pathInflatedActualArr = [];
            this.pathDeflatedActualArr = [];
            
            // reset all main properties
            //this.pathsUnion = null;
            this.clipperBySignalKey = [];
            this.intersectObjects = [];
            this.clipperDimension = [];
            this.clipperDimensionInfo = []; //V5.3D201701XX Added
            this.dimensionsToMill = [];
            this.clipperSignalWires = [];
            this.clipperElements = [];
            this.clipperPads = [];
            this.clipperSmds = [];
            this.clipperVias = [];
            //this.drillPads = {};  //V5.2D20170105 Commented replaced by holsToDrill/holesTolMill
            //this.drillVias = {};  //V5.2D20170105 Commented replaced by holsToDrill/holesTolMill
            this.holesToDrill = {}; //V5.2D20170105
            this.holesToMill = [];  //V5.2D20170105
            this.holesUnhandledCount = 0;   //V5.2D20170105
            this.paths = null; // final paths generated from onRefresh() used to export gcode
            this.pathsUnion = null;
            this.pathsUnionHoles = null;
            
        },
        setupGcodeTab: function() {
            // attach click event to "Send Gcode to workspace" button
            $('#com-chilipeppr-widget-eagle .btn-eagle-sendgcodetows').click(this.sendGcodeToWorkspace.bind(this));
            //$('#com-chilipeppr-widget-eagle .process-list').sortable();
            //$('#com-chilipeppr-widget-eagle .process-list').disableSelection();
        },
        sendGcodeToWorkspace: function() {
            var gcodetxt = "";

            this.exportGcode();
            var info = {
                name: "Eagle BRD: " + this.fileInfo.name.replace(/.brd$/i, ""), 
                lastModified: new Date()
            };
            // grab gcode from textarea
            gcodetxt = $('.com-chilipeppr-widget-eagle-gcode').val();

            if (gcodetxt.length < 10) {
                chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Error Sending Gcode", "It looks like you don't have any Gcode to send to the workspace. Huh?", 5 * 1000);
                return;
            }

            // send event off as if the file was drag/dropped
            chilipeppr.publish("/com-chilipeppr-elem-dragdrop/ondropped", gcodetxt, info);
            
            // convert the color on the end mill path because it's irrelevant now based
            // on the gcode being shown by the 3d viewer
            /* Uncaught TypeError: Failed to execute 'uniform3fv'
            this.threePathEndMill.forEach(function(threeObj) {
                console.log("tweaking endmill path now that we're sending gcode. threeObj:", threeObj);
                if (threeObj.children.length > 0) {
                    threeObj.children[0].material.opacity = 0.1;
                    threeObj.children[0].material.color = 0x000000;
                    // threeObj.children.forEach(function(threeObjChild) {
                    //    threeObjChild.material.color = 0x000000;
                    //    threeObjChild.material.opacity = 0.1;
                    //});
                } else {
                    threeObj.material.color = 0x000000;
                    threeObj.material.opacity = 0.1;
                }
            }, this);
            */            
            // or use alternate pubsub
            // "/com-chilipeppr-elem-dragdrop/loadGcode"
            var that = this;
            this.get3dObj(function() {
                console.log("got callback after 3dviewer re-sent us the 3dobj and 3dobjmeta. 3dobj:", that.obj3d, "obj3dmeta:", that.obj3dmeta);
                that.sceneReAddMySceneGroup();
            });
        },
        setupDragDrop: function () {
            // subscribe to events
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragover", this, this.onDragOver);
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragleave", this, this.onDragLeave);
            // /com-chilipeppr-elem-dragdrop/ondropped
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondropped", this, this.onDropped, 9); // default is 10, we do 9 to be higher priority
        },
        eagle: null, // contains the eagle object
        open: function (data, info) {
            
            // if we are passed the file data, then use that, otherwise look to 
            // see if we had one saved from before, i.e. this is a browser reload scenario
            // and we'd like to show them their recent Eagle BRD
            var file;
            if (data) {
                console.log("open. loading from passed in data. data.length:", data.length, "info:", info);
                file = data;
                this.fileInfo = info;
                $('#com-chilipeppr-widget-eagle .eagle-draghere').addClass("hidden");
            } else {
                
                // try to retrieve the most recent board file
                file = localStorage.getItem('com-chilipeppr-widget-eagle-lastDropped');
                if (file && file.length > 0) {
                    this.fileInfo = localStorage.getItem('com-chilipeppr-widget-eagle-lastDropped-info');
                    if (this.fileInfo && this.fileInfo.match(/^{/)) {
                        this.fileInfo = JSON.parse(this.fileInfo);
                    }
                    console.log("open. loading data from localStorage. file.length:", file.length, "info:", this.fileInfo);
                } else {
                    // there's no file, just return
                    return;
                }

            }
            
            if (file) {
                
                // make sure this file is an Eagle board
                if (!(file.match(/<!DOCTYPE eagle SYSTEM "eagle.dtd">/i))) {
                    chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Error Loading Eagle BRD", "It looks like you had a previous Eagle BRD, but it doesn't seem to be the correct format.", 10 * 1000);
                    return;
                               
                }

                chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Opening Eagle BRD", "Parsing Eagle BRD file and generating signal paths.", 3000, true);
                // reset main properties
                this.activeLayer = 'Top';
                this.clearEagleBrd();
                this.clear3dViewer();
                // create board
                this.eagle = new EagleCanvas('eagle-canvas');
                this.eagle.loadText(file);
                this.useDimensionLayer = this.eagle.dimensionLayerUsed && !this.eagle.millingLayerUsed;
                this.useMillingLayer = this.eagle.millingLayerUsed;
                $('#com-chilipeppr-widget-eagle .dimension-layer-20').prop('checked', this.useDimensionLayer);
                $('#com-chilipeppr-widget-eagle .dimension-layer-46').prop('checked', this.useMillingLayer);
                //this.eagle.setScaleToFit('eagle-main');
                //this.eagle.setScale(this.eagle.getScale() / 2);
                //this.eagle.draw();
                //var that = this;
                this.draw3d(function() {
                    console.log("got callback from draw3d");
                });
                
                chilipeppr.publish('/com-chilipeppr-widget-3dviewer/drawextents' );
                chilipeppr.publish('/com-chilipeppr-widget-3dviewer/viewextents' );
                $('#com-chilipeppr-widget-eagle .btn-eagle-sendgcodetows').prop('disabled', false);
                console.log("eagle:", this.eagle);
            } else {
                console.log("no last file, so not opening");
            }
        },
        /**
         * We need the 3D viewer to be ready to go for us to generate our 3D view,
         * so do a little bit of a wait sequence here where we try 3 times to
         * grab the 3D viewer object and then we can render our board.
         * Alternately, we could render our board and then inject into the 3D
         * viewer later. Not sure why I didn't do it that way initially.
         */
        draw3d: function (callback) {
            if (!this.is3dViewerReady) {
                var that = this;
                setTimeout(function () {
                    if (!that.is3dViewerReady) {
                        setTimeout(function () {
                            if (!that.is3dViewerReady) {
                                console.log("giving up on drawing into 3d for Eagle Brd");
                            } else {
                                console.log("ready to draw 3d on 3rd attempt");
                                that.onDraw3dReady();
                                if (callback) callback();
                            }
                        }, 5000);
                    } else {
                        console.log("ready to draw 3d on 2nd attempt");
                        that.onDraw3dReady();
                        if (callback) callback();
                    }
                }, 2000);
            } else {
                console.log("ready to draw 3d on 1st attempt");
                this.onDraw3dReady();
                if (callback) callback();
            }
        },
        colorSignal: 9249571, // match eagle colors. red for top wire
        colorSmd: 9249571, // same color as signal (again top)
        colorSignalBottom: 2302861,  //match eagle colors.  blue for bottom wire
        colorSmdBottom: 2302861,  //same color as signal (again bottom)
        colorVia: 11842560, // yellow
        colorPad: 2329891, // pads are green
        colorMill: 255, // match color ChiliPeppr shows for milling
        colorHole: 9276813, // light gray
        colorHoleUnhandled: 9046024,
        colorsDrop: [2722312, 8817160, 9046024] , // green, yellow, red
        colorDimension: 9276813, // light gray
        colorTabs: 0x4020A0,
        colorMilling: 0x238d8d,
        colorFailed: 0xff0000,
        opacitySignal: 0.1,
        opacityDimension: 0.3,
        opacityTabs: 0.5,
        opacityVia: 0.1,
        opacityPad: 0.1,
        endmillSize: 0.0, // size of endmill that user picks
        actualEndmill: 0.2,
        inflateMillPathBy: null,
        paths: null, // final paths generated from onRefresh() used to export gcode
        pathsUnion: null,
        pathsUnionHoles: null,
        //threeDimensions: null,
        boardBoundaries: null, //V5.1D20161229
        blankBoundaries: null, //Boundaries of blank PCB as defined in layer 47
        activeLayer: 'Top',
        clipperDimensions: [], // contains the dimensions of the board as clipper path
        //clipperDimensionsInfo: [], //V5.3D201701XX Added
        //dimensionInfo: [], //V5.3D201701XX Added
        /**
         * This is a key method that will actually start the traversal of the
         * entire Eagle BRD and generate Three.js objects for each pad/smd/via/wire, etc.
         * Then it will generate Clipper Paths which are just 2d xy values in the
         * format that the Clipper library wants so we can do unions and diffs
         * which is important to generate the isolation paths as well as deal with
         * polygons that may be on the board representing signal planes like a 
         * GND plane.
         */
        onDraw3dReady: function () {
            
    		console.group("draw3d");

            // inform any listeners that we're starting parsing, i.e. we're done with
            // all of our draw3dxxx functions which means all our three.js objects
            // and clipper objects are generated.
            chilipeppr.publish("/" + this.id + '/beforeLayerGenerate', this);

            this.populateLayerToggleDropdown();
            console.log("iterating Eagle Brd and drawing into 3d viewer");
            console.log("eagle obj we will draw:", this.eagle);
            
            this.clear3dViewer();
            //var activeLayer = 'Top';
            //var activeLayer = 'Bottom';
            
            // these methods will draw all Eagle objects into several global
            // properties, the most important of which is this.clipperBySignalKey
            // which holds a structured object of each signal, i.e. +3V, GND, etc.
            this.draw3dBlankBoard();
            this.draw3dRegHoles();
            this.buildDimensionClipper();

            //Mirror board dimensions
            for(var c = 0; c < this.clipperDimension.length; c++){
                this.clipperDimension[c].X = this.flipX(this.clipperDimension[c].X);
                this.clipperDimension[c].Y = this.flipY(this.clipperDimension[c].Y);
            }
            this.draw3dSignalWires(this.eagle.eagleLayersByName[this.activeLayer]);
            this.draw3dSignalPolygons(this.eagle.eagleLayersByName[this.activeLayer]);
            this.draw3dElements(this.eagle.eagleLayersByName[this.activeLayer]);
            this.draw3dVias('1-16');
            this.draw3dDimension();
            this.draw3dHoles(); //V5.2D20170105 Added
            this.dimensionsToMill = this.getBoardDimensionsToMill();
            this.draw3dTabs();
            //this.threeDimensions = this.draw3dDimension(this.endmillSize);
            //this.obj3d.children = [];
            
            // obj3d is the original THREE.Object3D() for the 3d
            // viewer. the extents x/y/z vals are calculated off of
            // it so we need a fake object to put in there
            console.log("this.obj3d:", this.obj3d);
            
            //This line is disable to keep view angle unchanges when refresh is clicked
            //XXXchilipeppr.publish('/com-chilipeppr-widget-3dviewer/viewextents' );
            
            // inform any listeners that we're done parsing, i.e. we're done with
            // all of our draw3dxxx functions which means all our three.js objects
            // and clipper objects are generated.
            chilipeppr.publish("/" + this.id + '/afterLayerGenerate', this);

            setTimeout(this.onRefresh.bind(this, null, this.onDraw3dReadyAfter), 2000);

            // for debug, spit out console info
            var that = this;
            setTimeout(function() {
                console.log("DONE GENERATING BOARD. this:", that, "eagle obj we will draw:", that.eagle);
            }, 4000);
            
            console.log("done drawing Eagle PCB Board");
            console.groupEnd();
        },
        onDraw3dReadyAfter: function() {
            console.log("onDraw3dReadyAfter");
            // ask 3d viewer to set things up now
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/setunits', "mm" );
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/drawextents' );
            //This line is disable to keep view angle unchanges when refresh is clicked
            //XXXchilipeppr.publish('/com-chilipeppr-widget-3dviewer/viewextents' );
            $(window).trigger('resize');
            if (this.obj3dmeta && this.obj3dmeta.widget) {
                this.obj3dmeta.widget.wakeAnimate();
            }
            
        },

        // Section on exporting Gcode
        //TODO: I think following variables should be initialized from HTML values or the other way around
        clearanceHeight: 1.0, // move z to clearance
        // 1 oz = 0.035mm, 2 oz = 0.07mm, 3 oz = 0.105mm
        depthOfSignalMilling: -0.1, // cutting how deep?
        feedRatePlunge: 30, // plunging into FR4 copper
        feedRateSignals: 80, // feedrate for milling signals,pads,smds,vias
        feedRateDimensions: 100,
        drillFeedrate: 100.0, // mm/min
        drillMaxDiameter: 2.00, //mm/min //V5.2D20170105 changed to 2.00 to match default value on widget.html
        drillDepth: -1.7, // std thickness
        depthOfDimensions: -1.7, // std thickness
        millDiameter: 1,
        millDiameterMin: 1,
        useDimensionLayer: false,
        useMillingLayer: false,
        cuttingToolOption: 0,
        minWireWidthToMill: 1,
        ignoreSmallWires: false,
        stepDownDimensions: -0.5,
        stepDownPasses: 3, // use passes or dimension
        spindleRPM: 12000, // spindle rotation speed (rpm)
        exportGcodeHeader:function(){
            var g = '';
            g += "(Gcode generated by ChiliPeppr Eagle PCB Widget " + (new Date()).toLocaleString() + ")\n";
            g += "G21 (mm mode)\n";
            g += "G90 (abs mode)\n";

            return g;
        },
        exportGcodeMilling:function(){
            var g = '';
            if(! $('#com-chilipeppr-widget-eagle .use-traces').is(':checked')) return g;

            g += "T0 M6 (Milling Traces)\n"
            g += "(T0 D=" + parseFloat($('#com-chilipeppr-widget-eagle .inflate-by').val()) * 2 + "mm - PCB Milling Bit)\n";
            g += "M3 S" + this.spindleRPM + " (spindle on)\n";
            var dir = $('#DirectionMilling').val();
            this.paths.forEach(function(path) {
                if(dir>0){
                    var o = ClipperLib.Clipper.Orientation(path);
                    if(o != (dir==1)) path.reverse();//True=Convientional (CCW), False=Climb (CW)
                }
                // move to clearance
                g += "G0 Z" + this.clearanceHeight + "\n";
                // move to first position of path
                g += "G0 X" + path[0].X + " Y" + path[0].Y + "\n";
                // move down
                g += "G0 Z0\n";
                g += "G1 Z" + this.depthOfSignalMilling + " F" + this.feedRatePlunge + "\n";
                g += "F" + this.feedRateSignals + "\n";
                for (var i = 1; i < path.length; i++) {
                    var pt = path[i];
                    g += "G1 X" + pt.X + " Y" + pt.Y + "\n";
                }
                // move to first point
                g += "G1 X" + path[0].X + " Y" + path[0].Y + "\n";
                // just to be safe, move to 2nd point to ensure all copper milled out
                // but make sure we go at least 2mm, but no more
                var v1 = new THREE.Vector3(path[0].X, path[0].Y);
                var v2 = new THREE.Vector3(path[1].X, path[1].Y);
                var dist = v1.distanceTo(v2);
                if (dist > 2) {
                    // shorten it
                    var direction = new THREE.Vector3(v2.x-v1.x, v2.y-v1.y, 0);
                    direction.normalize();
                    var ray = new THREE.Ray(v1, direction);
                    v2 = ray.at(2);
                    //console.log("had to shorten distance. ray:", ray, " new v2:", v2, "v1:", v1);
                }
                g += "G1 X" + v2.x + " Y" + v2.y + "\n";
                if (dist < 2) {
                    // go to 3rd point as well
                    g += "G1 X" + path[2].X + " Y" + path[2].Y + "\n";
                }
                
                // done with signal, go to z clearance
                
                
            }, this);

            return g;
        },
        //V5.2D20170105 Added
        exportGcodeMarkHoles:function(){
            var g = '';
            var that = this;

            if((! $('#com-chilipeppr-widget-eagle .drill-markholes').is(':checked')) ||
                this.holesToDrill.length == 0)
               return g;

            // Drilling, first sort to drill diameter and change tool to first diameter
            g += "(------ MARK HOLES -------)\n";
            for ( var diameter in this.sortObjByKey(this.holesToDrill) ){
               this.holesToDrill[diameter].forEach(function(dvector){
                     g += "G0 Z" + that.clearanceHeight + "\n";
                     g += "G0 X" + dvector.X + " Y" + dvector.Y   + "\n";
                     g += "G0 Z0.1\n";
                     g += "G1 Z" + that.depthOfSignalMilling  + "\n";
                });
                g += "G0 Z" + that.clearanceHeight + "\n";
            }
            return g;
        },
        //V5.2D20170105 Added
        exportGcodeDrillHoles:function(){
            var g = '';
            var that = this;
            
            if((! $('#com-chilipeppr-widget-eagle .use-drilling').is(':checked')) ||
                this.holesToDrill.length == 0)
               return g;
            g += "(------ DRILLING HOLES -------)\n";
            for ( var diameter in this.sortObjByKey(this.holesToDrill) ){
               g += "M5 (spindle off)\n";
               //g += "T" + this.toolCount++ + " M6 (set tool to drill with diameter " + diameter + "mm)\n";
               g += "T" + ++this.toolCount + " M6 (Drilling holes - diameter " + diameter + "mm)\n";
               g += "(T" + this.toolCount + " D=" + diameter + "mm - PCB Drill Bit)\n";
               g += "M3 S" + this.spindleRPM + " (spindle on)\n";
               g += "F" + this.drillFeedrate + "\n"; 
               this.holesToDrill[diameter].forEach(function(dvector){
                     g += "G0 Z" + that.clearanceHeight + "\n";
                     g += "G0 X" + that.round(dvector.X) + " Y" + that.round(dvector.Y)   + "\n";
                     g += "G0 Z" + that.clearanceHeight/10 + "\n";
                     g += "G1 Z" + that.drillDepth  + "\n";
                });
                g += "G0 Z" + that.clearanceHeight + "\n";
            }
            return g;
        },
        //V5.2D20170105 Added
        exportGcodeMillHoles:function(){
            var g = '';
            var isGrblGws = window.location.pathname.includes("jpadie") || window.location.pathname.includes("grbl");
            if(! $('#com-chilipeppr-widget-eagle .use-milling').is(':checked')) return g;
            var that = this;
            var dir = $('#DirectionCutting').val();
            //var diaOfEndmill = $('.dimension-mill-diameter').val();
            var diaOfEndmill = that.millDiameterMin;
            if((! $('#com-chilipeppr-widget-eagle .use-drilling').is(':checked')) ||
                this.holesToMill.length == 0)
               return g;
            g += "(------ MILLING HOLES -------)\n";
            g += "M5 (spindle off)\n";
            g += "T" + ++this.toolCount + " M6 (Milling holes/board dimensions)\n";
            g += "(T" + this.toolCount + " D=" + diaOfEndmill + "mm - PCB End Mill)\n";
            g += "M3 S" + this.spindleRPM + " (spindle on)\n";
            g += "F" + this.feedRateDimensions + "\n";
            this.holesToMill.forEach(function(hole) {
                //g += that.generateGcodeHole(hole.D, hole.X, hole.Y)
                var radius = hole.D/2;
                var gdiameter = radius-(that.millDiameter/2); // inside milling 
                var stepDownPasses = Math.round(that.depthOfDimensions/that.stepDownDimensions + .5);
                g += '(generate hole at x:' + hole.X + ' y:' + hole.Y + ' with dia:'+ hole.D +' in ' + stepDownPasses + ' passes)' + "\n";
                g += "F" + that.feedRateDimensions + "\n";
                g += "G0 Z" + that.clearanceHeight + "\n";
                g += "G0 X" + that.round(hole.X - gdiameter) + " Y" + that.round(hole.Y) + "\n";
                for(var i=0; i<stepDownPasses;i++){
                    var z = that.stepDownDimensions*(i+1);
                    if(z < that.depthOfDimensions)
                        z = that.depthOfDimensions;
                    g += "G1 Z" + z.toFixed(4) + "\n"; //V5.2QUICKFIX
                    g += (dir==2)?"G2":"G3";
                    if(isGrblGws) g += " X" + that.round(hole.X - gdiameter) + " Y" + that.round(hole.Y); // Temporary fix, should change the code to be compatible with all controllers
                    g += " I" + gdiameter.toFixed(4) + "\n";
                }
                g += "G0 Z" + that.clearanceHeight + "\n";
            });
            return g;
        },
        /**
         * This function will create inflate/deflate board dimension paths without using ClipperLib 
         * the resulting path(s) will be an array of lines and curves, this was necessary to implement the Tabs feature
         * introduced in V5.4, as a redults curves will be rendered as G02/G03 gcode command.
         */
        getBoardDimensionsToMill:function(){
            var boardDimensionsToMill = [];
            var dLayerNumber = this.eagle.eagleLayersByName['Dimension'].number;
            var mLayerNumber = this.eagle.eagleLayersByName['Milling'].number;
            var fl = ((this.mirrorX && !this.mirrorY) ||(!this.mirrorX & this.mirrorY));
            
            for(var n=0; n<this.clipperDimensionInfo.length; n++){
                var cdi = this.clipperDimensionInfo[n];
                var or = ClipperLib.Clipper.Orientation(this.clipperDimension.slice(cdi.start, cdi.end+1));
                if ((cdi.type == -2) ||
                    (!this.useMillingLayer && cdi.layer == mLayerNumber) ||
                    (!this.useDimensionLayer && cdi.layer == dLayerNumber)  ||
                    (cdi.millDiameter == 0)) continue;
                    
                var alongPath = cdi.type == -1 || (cdi.type >= 0 && cdi.width >= this.minWireWidthToMill);
                var hasCurves = cdi.curves.length > 0;
                var ci = 0; //curve index
                var dimensionPath = {X:0, Y:0, millDiameter:cdi.millDiameter, lines:[], isOpen:(cdi.type < 0)};
                for(var j=cdi.start; j<cdi.end; j++){
                    var v1i, v2i, v3i, isThisLineCurve, isNextLineCurve, thisCurve = {}, nextCurve = {}, thisCurveAngle = 0, nextCurveAngle = 0;
                    isThisLineCurve = hasCurves && cdi.curves[ci].start == j
                    if(isThisLineCurve){
                        v1i = j;
                        v2i = cdi.curves[ci].end+1;
                        v3i = cdi.curves[ci].end+2;
                        thisCurveAngle = cdi.curves[ci].curve;
                        j=cdi.curves[ci].end;   
                        if((ci+1) < cdi.curves.length) ci++; else ci=0;
                    }
                    else{
                        v1i = j; v2i = j+1; v3i = j+2;
                    }
                        
                    if(v3i > cdi.end){
                        if(cdi.type < 0) v3i = cdi.start;
                        else {v2i =cdi.start; v3i = cdi.start+1;}
                    }
                    
                    isNextLineCurve = hasCurves && cdi.curves[ci].start == v2i;
                    if(isNextLineCurve){
                        v3i = cdi.curves[ci].end+1;
                        nextCurveAngle = cdi.curves[ci].curve;
                        //if(v3i == cdi.end-1) v3i++;
                        
                    }
                    var v1 = this.clipperDimension[v1i];
                    var v2 = this.clipperDimension[v2i];
                    var v3 = this.clipperDimension[v3i];
                    var angle1 = Math.atan2(v2.Y-v1.Y, v2.X-v1.X) - 3*Math.PI/2;
                    var angle2 = Math.atan2(v3.Y-v2.Y, v3.X-v2.X) - 3*Math.PI/2;
                    if(or) {angle1 += Math.PI; angle2 += Math.PI;}
                    
                    if(fl) {thisCurveAngle=-thisCurveAngle; nextCurveAngle=-nextCurveAngle;}
                    if(isThisLineCurve) thisCurve = this.getCurveParameters(v1.X, v1.Y, v2.X, v2.Y, thisCurveAngle);
                    if(isNextLineCurve) nextCurve = this.getCurveParameters(v2.X, v2.Y, v3.X, v3.Y, nextCurveAngle);
                    
                    if(alongPath){
                        if(v1i == cdi.start){ dimensionPath.X = v1.X; dimensionPath.Y = v1.Y; }
                        if(isThisLineCurve){
                            dimensionPath.lines.push({X:v2.X, Y:v2.Y, isCurve:true,
                                C:{ X:thisCurve.x, Y:thisCurve.y, radius: thisCurve.radius,
                                    startAngle:thisCurve.startAngle,
                                    endAngle:thisCurve.endAngle,
                                    curve: thisCurveAngle,
                                    clockWise: thisCurve.clockWise}
                                });
                        }
                        else
                            dimensionPath.lines.push({X:v2.X, Y:v2.Y, isCurve:false});
                    }
                    else{
                        var dx, dy, rd = cdi.millDiameter/2;
                        var a1 = this.fixAngle(isThisLineCurve? thisCurve.startAngle : angle1);
                        var a2 = this.fixAngle(isThisLineCurve? thisCurve.endAngle   : angle1);
                        var a3 = this.fixAngle(isNextLineCurve? nextCurve.startAngle : angle2);
                        if(cdi.type == 1){
                            a1 = Math.PI + a1;
                            a2 = Math.PI + a2;
                            a3 = Math.PI + a3;
                        }
                        var isThisConcave = (or && thisCurveAngle<0) || (!or && thisCurveAngle>0);
                        var isNextConcave = (or && nextCurveAngle<0) || (!or && nextCurveAngle>0);
                        if(isThisConcave) {a2 = a2 - Math.PI; a1 = a1 - Math.PI;}
                        if(isNextConcave) {a3 = a3 - Math.PI};
                        var a4 = a3 - a2;
                        var a5 = (a2 - a3 + Math.PI)/2;
                        var s4 = Math.sin(a4);
                        var isCrossing = (!or && (s4 > 0.0001)) || (or && (s4 < -0.0001)); // inflated lines will cross if a4 angle is larger than zero and smaller than 180
                        if(cdi.type == 1) isCrossing = !isCrossing;

                        dx = rd * Math.cos(a1); dy = rd * Math.sin(a1);
                        var v4 = {X: v1.X + dx, Y: v1.Y + dy};
                        dx = rd * Math.cos(a2); dy = rd * Math.sin(a2);
                        var v5 = {X: v2.X + dx, Y: v2.Y + dy};
                        dx = rd * Math.cos(a3); dy = rd * Math.sin(a3);
                        var v6 = {X: v2.X + dx, Y: v2.Y + dy};
                        if(isCrossing){
                            var hypotenuse = rd * Math.cos(a5) / Math.sin(a5);
                            dx = hypotenuse * Math.cos(a2 + 3 * Math.PI/2);
                            dy = hypotenuse * Math.sin(a2 + 3 * Math.PI/2);
                            var v7 = {X: v5.X - dx, Y: v5.Y - dy};
                            v5 = v7;
                        }
                        if(isThisLineCurve){
                            dimensionPath.lines.push({X:v5.X, Y:v5.Y, isCurve:true, 
                                C:{ X: thisCurve.x, Y: thisCurve.y, radius: thisCurve.radius+(isThisConcave?-rd:rd),
                                    startAngle:thisCurve.startAngle,
                                    endAngle:thisCurve.endAngle - isCrossing?a5:0,
                                    curve: thisCurveAngle,
                                    clockWise: thisCurve.clockWise}
                                });
                        }
                        else
                            dimensionPath.lines.push({X:v5.X, Y:v5.Y, isCurve:false});
                            
                        //var isSameAngle = (Math.abs(a3-a2) % (2*Math.PI)) < 0.0001;
                        var isSameAngle = (Math.abs(Math.sin(a3)-Math.sin(a2)) < 0.0001) && 
                                          (Math.abs(Math.cos(a3)-Math.cos(a2)) < 0.0001);
                        if(!isSameAngle && !isCrossing){
                            var cr = a3-a2;
                            dimensionPath.lines.push({X:v6.X, Y:v6.Y, isCurve:true, 
                                C:{ X:v2.X, Y:v2.Y, radius: rd,
                                    startAngle:a2,
                                    endAngle:a3,
                                    curve: cr * 180 / Math.PI,
                                    clockWise: cdi.type==1?or:!or}//or?cr<0:a3-a2>0}
                                });
                        }
                        var ix = dimensionPath.lines.length - 1;
                        dimensionPath.X = dimensionPath.lines[ix].X;
                        dimensionPath.Y = dimensionPath.lines[ix].Y;
                    }
                }
                boardDimensionsToMill.push(dimensionPath);
            }
            return boardDimensionsToMill;
        },
        //This method will covert any angle to an number between 0 and 2PI
        //No effect on functionality but it's useful for debugging
        fixAngle: function(angle){
            var a = angle % (2*Math.PI);
            return (a<0? 2*Math.PI+a: a);
        },
        exportGcodeDimensions:function(){
            var g = '';
            if(! $('#com-chilipeppr-widget-eagle .use-milling').is(':checked')) return g;
            
            //var dimensions = this.getBoardDimensionsToMill();
            var dimensions = this.dimensionsToMill;
            var lastToolDia = this.holesToMill.length>0?this.millDiameterMin:-1;
            var dir = $('#DirectionCutting').val();
            console.group("Generating Dimension Milling");
            // // if we have no dimensions, then let's return
            // if (!millDim || !millDim.length > 0) {
            //     console.warn("for some reason there's no clipperDimension. huh?. returning.");
            //     return g;
            // }
            for(var i=0; i<dimensions.length; i++){
                diaOfEndmill = dimensions[i].millDiameter;
                var isOpen = dimensions[i].isOpen;
                if(diaOfEndmill != lastToolDia){//if we already milled some holes, there is no need to do tool change
                    g += "M5 (spindle off)\n";
                    g += "T" + ++this.toolCount + " M6 (Milling board dimensions)\n";
                    g += "(T" + this.toolCount++ + " D=" + diaOfEndmill + "mm - PCB End Mill)\n";
                    g += "M3 S" + this.spindleRPM + " (spindle on)\n";
                    g += "F" + this.feedRateDimensions + "\n";
                    lastToolDia = diaOfEndmill;
                }
                var lastPass = false;
                var newZ = 0;
                var v1 = {X: dimensions[i].X, Y: dimensions[i].Y};
                g += "G0 Z" + this.clearanceHeight + "\n";
                g += "(dimensions)\n";
                g += "G0 X" + this.round(v1.X) + " Y" + this.round(v1.Y) + "\n";
                g += "G0 Z0\n";
                while (!lastPass){
                    newZ += this.stepDownDimensions;
                    if (newZ <= this.depthOfDimensions) {
                        newZ = this.depthOfDimensions;
                        lastPass = true;
                    }
                    g += "(step down " + this.stepDownDimensions + " for new z " + newZ + ")\n";
                    g += "G1 Z" + newZ + " F" + this.feedRatePlunge + "\n";
                    g += "F" + this.feedRateDimensions + "\n";
                    for(var j=0; j<dimensions[i].lines.length; j++){
                        line = dimensions[i].lines[j];
                        var v2 = {X: line.X, Y: line.Y};
                        if(line.isCurve){
                            g += this.getDimensionGcode(v2, v1, newZ, isOpen, line.C);
                        }
                        else{
                            g += this.getDimensionGcode(v2, v1, newZ, isOpen);
                        }
                        v1 = v2;
                    }
                    v1 = {X: dimensions[i].X, Y: dimensions[i].Y};
                    //AMEEN TODO: Mill open paths without retracting the bit, a reverse loop through the path is required
                    //Better if we make it as an option in UI
                    if(dimensions[i].isOpen && !lastPass){
                        g += "G0 Z" + this.clearanceHeight + "\n";
                        g += "G0 X" + v1.X + " Y" + v1.Y + "\n";
                        g += "G0 Z0\n";
                    }
                }
            }
            console.groupEnd();
            return g;
        },
        //This function will generate gcode for single sigment of dimension path(s)
        //it handles line as well as curves
        //it will also generate tabs if applicable
        getDimensionGcode: function(v2, v1, z, isOpen, curve){
            var tabMaxZ = this.round(this.depthOfDimensions + this.tabs.height);
            if(curve === undefined){
                var g = "G1 X" + this.round(v2.X) + " Y" + this.round(v2.Y) + "\n";
                if (!this.tabs.useTabs || isOpen || z > tabMaxZ) return g;
                
                var length = Math.sqrt((v2.X-v1.X)*(v2.X-v1.X) + (v2.Y-v1.Y)*(v2.Y-v1.Y));
                var count = Math.round(length/this.tabs.distance - 0.5);
                if (!(count>0)) return g;
                
                var gt = "";
                var angle = Math.atan2(v2.Y-v1.Y, v2.X-v1.X);
                for(var n=0; n<count; n++){
                    var d = (length - this.tabs.distance * (count-1))/2 + n * this.tabs.distance;
                    var dw = this.tabs.width / 2;
                    var x1 = v1.X + (d - dw) * Math.cos(angle);
                    var y1 = v1.Y + (d - dw) * Math.sin(angle);
                    var x2 = v1.X + (d + dw) * Math.cos(angle);
                    var y2 = v1.Y + (d + dw) * Math.sin(angle);
                    x1 = this.round(x1);
                    y1 = this.round(y1);
                    x2 = this.round(x2);
                    y2 = this.round(y2);
                    gt += "G1 X" + x1 + " Y" + y1 + "\n";
                    gt += "G1 Z" + tabMaxZ + "\n";
                    gt += "G1 X" + x2 + " Y" + y2 + "\n";
                    gt += "G1 Z" + this.round(z) + "\n";
                }
                return gt + g;
            }
            else{
                var gc = curve.clockWise?"G2":"G3";
                var I = curve.X - v1.X;
                var J = curve.Y - v1.Y;
                var g = gc + " X" + this.round(v2.X) + " Y" + this.round(v2.Y) + " I" + this.round(I) + " J" + this.round(J) + "\n";
                if (!this.tabs.useTabs || isOpen || z > tabMaxZ) return g;

                var angle = curve.curve * Math.PI / 180;
                var alpha = this.tabs.distance / curve.radius;
                var beta  = (this.tabs.width / 2) / curve.radius;
                var sign = curve.clockWise?-1:1;
                var count = Math.round(Math.abs(angle/alpha) - 0.5);
                if (!(count>0)) return g;
                var gt = "";
                for(var n=0; n<count; n++){
                    var a = curve.startAngle + sign*(Math.abs(angle) - alpha * (count-1))/2 + sign*n * alpha;
                    var x1 = curve.X + curve.radius * Math.cos(a-sign*beta);
                    var y1 = curve.Y + curve.radius * Math.sin(a-sign*beta);
                    var x2 = curve.X + curve.radius * Math.cos(a+sign*beta);
                    var y2 = curve.Y + curve.radius * Math.sin(a+sign*beta);
                    x1 = this.round(x1);
                    y1 = this.round(y1);
                    x2 = this.round(x2);
                    y2 = this.round(y2);
                    gt += gc + " X" + x1 + " Y" + y1 + " I" + I + " J" + J + "\n";
                    gt += "G1 Z" + tabMaxZ + "\n";
                    I = curve.X - x1; J = curve.Y - y1;
                    gt += gc + " X" + x2 + " Y" + y2 + " I" + this.round(I) + " J" + this.round(J) + "\n";
                    I = curve.X - x2; J = curve.Y - y2;
                    gt += "G1 Z" + this.round(z) + "\n";
                }
                var g = gc + " X" + this.round(v2.X) + " Y" + this.round(v2.Y) + " I" + this.round(I) + " J" + this.round(J) + "\n";
                return gt + g;
            }
        },
        round: function(n){
            return(Math.round(n*10000)/10000); //Limit decimal places to avoid issues with Grbl
        },
        exportGcodeFooter:function(){
            
            var g = '';
            g += "(------ FOOTER -------)\n";

            // move to clearance
            g += "G0 Z" + this.clearanceHeight + "\n";
            
            // finalize gcode
            g += "M5 (spindle stop)\n";
            g += "M30 (prog stop)\n";
            return g;
        },
        exportGcode: function() {
            // We will walk through our mondo clipperBySignalKey object to generate
            // our gcode.
            // we will start with wires,smds,pads,vias first.
            // then we'll move onto drills.
            // then we'll finish with dimensions because use may want to swap
            // endmills at end.
            // we will also start at lower left and work our way along the end of each
            // path and move to next.
            // we also need to remove redundant moves.
            
            this.toolCount = 0;
            var i = 100;
            this.addGcode(i, this.exportGcodeHeader()     );
            i += 100;
            this.addGcode(i, this.exportGcodeMilling()    );
            i += 100;
            //this.addGcode(i, this.exportGcodeMarkVias()   );  //V5.2D20170105 Commented
            //i += 100;                                         //V5.2D20170105 Commented
            this.addGcode(i, this.exportGcodeMarkHoles()   );   //V5.2D20170105 added
            // this.addGcode(i, this.exportGcodeMarkPads()   ); //V5.2D20170105 Commented
            i += 100;
            this.addGcode(i, this.exportGcodeDrillHoles()  );   //V5.2D20170105 added
            // this.addGcode(i, this.exportGcodeDrillVias()  ); //V5.2D20170105 Commented
            i += 100;
            this.addGcode(i, this.exportGcodeMillHoles()  );    //V5.2D20170105 added
            // this.addGcode(i, this.exportGcodeDrillPads()  ); //V5.2D20170105 Commented
            i += 100;
            this.addGcode(i, this.exportGcodeDimensions() );
            i = 2000;
            this.addGcode(i, this.exportGcodeFooter()      ); // let space for additional gcode entrys

            // ask for additional gcode
            // the user should synchronously inject it by calling back to us
            // with eagleWidget.addGcode();
            chilipeppr.publish(
                "/com-chilipeppr-widget-eagle/addGcode", 
                this.addGcode.bind(this), 
                this.gcodeParts, 
                this, 
                'You need to callback the first parameter with a command like firstParameter(1000, "my gcode");. ' + 
                '1000 would put your gcode after all the gcode generated by the base widget, but before the footer ' +
                'which is at index of 2000. You can inspect the base widget gcode by looking at the 2nd parameter ' + 
                'which is an array of the gcode parts and their indexes because you can insert anywhere there is an unused index.'
            );

            // once we get here all 3rd party add-ons that were listening for the publish should have
            // injected their gcode and we can now move on
            var g = this.getGcode();
            
            console.log("done generating gcode. length:", g.length);
            $('.com-chilipeppr-widget-eagle-gcode').text(g);
        },
        gcodeParts: [],
        addGcode : function(count, gcode){
            this.gcodeParts[count] = gcode;
        },
        getGcode : function() {
            console.log('Get gcodeParts: ', this.gcodeParts);
            return this.gcodeParts.join('');
        },
        
        
        // Actual parsing of Eagle object and rendering of Three.js objects
        // and the Clipper paths.
        
        setupAdvancedInflateByUI: function() {
            var smdEl = $('#com-chilipeppr-widget-eagle .inflate-smds-by');
            var padEl = $('#com-chilipeppr-widget-eagle .inflate-pads-by');
            var viaEl = $('#com-chilipeppr-widget-eagle .inflate-vias-by');
            smdEl.keyup(function(evt) {
                console.log("smdEl got keyup. evt:", evt);
                $('#com-chilipeppr-widget-eagle .use-inflate-smds-by').prop('checked', true);
                var val = parseFloat(smdEl.val());
                if (isNaN(val)) {
                    smdEl.addClass("alert-danger");
                } else {
                    smdEl.removeClass("alert-danger");
                }
            });
            padEl.keyup(function(evt) {
                console.log("padEl got keyup. evt:", evt);
                $('#com-chilipeppr-widget-eagle .use-inflate-pads-by').prop('checked', true);
                var val = parseFloat(padEl.val());
                if (isNaN(val)) {
                    padEl.addClass("alert-danger");
                } else {
                    padEl.removeClass("alert-danger");
                }
            });
            viaEl.keyup(function(evt) {
                console.log("viaEl got keyup. evt:", evt);
                $('#com-chilipeppr-widget-eagle .use-inflate-vias-by').prop('checked', true);
                var val = parseFloat(viaEl.val());
                if (isNaN(val)) {
                    viaEl.addClass("alert-danger");
                } else {
                    viaEl.removeClass("alert-danger");
                }
            });
                
            // bind ctrl+enter
            var that = this;
            $('#com-chilipeppr-widget-eagle #eagle-main input').keypress(function(evt) {
                console.log("got keypress. evt:", evt);
                if (evt.ctrlKey && evt.charCode == 10) {
                    that.onRefresh(evt);
                }
            });
        },
        onFullRefresh: function(event, callback) {
            if (event) {
                // this was from a button click. hide popover
                $('#com-chilipeppr-widget-eagle .btn-refresh').popover('hide');
            }
            this.clearEagleBrd();
            this.draw3d();
        },
        onRefresh: function(event, callback) {
            
            console.log("onRefresh. event:", event);
            
            if (event) {
                // this was from a button click. hide popover
                $('#com-chilipeppr-widget-eagle .btn-refresh').popover('hide');
            }
            
            // fire off the pubsub signal indicating we're rendering
            chilipeppr.publish('/' + this.id + '/beforeToolPathRender', this);
            
            this.inflateMillPathBy = parseFloat($('#com-chilipeppr-widget-eagle .inflate-by').val());
            var isMagicWand = $('#com-chilipeppr-widget-eagle .magic-wand-active').is(':checked');
            var isShow = $('#com-chilipeppr-widget-eagle .show-actual').is(':checked');
            var isSolid = $('#com-chilipeppr-widget-eagle .show-actual-asmesh').is(':checked');
            
            var extraTxt = "";
            if (isShow) extraTxt += "<br/><br/>You are showing the toolpath, so that will be rendered as well.";
            if (isSolid) extraTxt += " You wanted to show the paths as solid, so that may take minutes to generate.";
            if (isMagicWand) extraTxt += "<br/><br/>You asked for the Magic Wand, so we need to generate constrained normals for all toolpaths. This will take a long time. Please be patient.";
            
            chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Rendering Eagle BRD", "Rendering signals, vias, pads, SMD's, polygons, and thermals. " + extraTxt, 3 * 1000);
            // remove old mill path and inflated path
            setTimeout(this.onRefresh2nd.bind(this, event, callback), 200);
        },
        threePathEndMill: [],
        onRefresh2nd: function(event, callback) {
            
            this.inflateMillPathBy = parseFloat($('#com-chilipeppr-widget-eagle .inflate-by').val());
            var isMagicWand = $('#com-chilipeppr-widget-eagle .magic-wand-active').is(':checked');
            var isShow = $('#com-chilipeppr-widget-eagle .show-actual').is(':checked');
            var isSolid = $('#com-chilipeppr-widget-eagle .show-actual-asmesh').is(':checked');
            
            this.threePathEndMill.forEach(function(p) {
                this.sceneRemove(p);
            }, this);
            this.threePathEndMillArr.forEach(function(p) {
                this.sceneRemove(p);
            }, this);
            this.threePathEndMill = [];
            this.threePathEndMillArr = [];
            
            this.clear3dViewer();
            this.sceneReAddMySceneGroup();
            
            // COMPLICATED
            // 1. We need to create a path for the wires, smds, pads, and vias
            // for each signal
            // 2. Then we figure out polygons and remove from the polys the path
            // from step 1. We should actually remave the inflated paths of the
            // step 1 poly. That will leave us with a clipped poly
            // 3. Then we remove smds and pads from the poly.
            
            
            
            // let's let user use different inflate values for different types of segments
            var inflateBy = this.inflateMillPathBy;
            var inflateWiresBy = inflateBy; //0.35;
            var inflateSmdsBy = inflateBy; //0.25;
            var inflatePadsBy = inflateBy; //0.3;
            var inflateViasBy = inflateBy; //0.4;
            var inflatePolysBy = 0;
            
            // See if user overrode these (which is only allowed without magic wand)
            if ($('#com-chilipeppr-widget-eagle .use-inflate-smds-by').is(':checked')) {
                var val = parseFloat($('#com-chilipeppr-widget-eagle .inflate-smds-by').val());
                if (isNaN(val)) {
                    $('#com-chilipeppr-widget-eagle .inflate-smds-by').addClass("alert-danger");
                } else {
                    $('#com-chilipeppr-widget-eagle .inflate-smds-by').removeClass("alert-danger");
                    inflateSmdsBy = val;
                }
            }
            if ($('#com-chilipeppr-widget-eagle .use-inflate-pads-by').is(':checked')) {
                var val = parseFloat($('#com-chilipeppr-widget-eagle .inflate-pads-by').val());
                if (isNaN(val)) {
                    $('#com-chilipeppr-widget-eagle .inflate-pads-by').addClass("alert-danger");
                } else {
                    $('#com-chilipeppr-widget-eagle .inflate-pads-by').removeClass("alert-danger");
                    inflatePadsBy = val;
                }
            }
            if ($('#com-chilipeppr-widget-eagle .use-inflate-vias-by').is(':checked')) {
                var val = parseFloat($('#com-chilipeppr-widget-eagle .inflate-vias-by').val());
                if (isNaN(val)) {
                    $('#com-chilipeppr-widget-eagle .inflate-vias-by').addClass("alert-danger");
                } else {
                    $('#com-chilipeppr-widget-eagle .inflate-vias-by').removeClass("alert-danger");
                    inflateViasBy = val;
                }
            }
            
            // let's use the new clipperBySignalKey object
            var paths = [];
            console.log("this.clipperBySignalKey:", this.clipperBySignalKey);
            var keys = Object.keys(this.clipperBySignalKey);
            var debugZ = 0.5;
            
            // Step 0.8. If user wants to remove undefined SMDs from the path rendering
            // i.e. we'll just not mill them out
            
            if ($('#com-chilipeppr-widget-eagle .use-smd-ignoreundefined').is(':checked')) {

                console.log("removing undefined signal smds");                
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var signal = this.clipperBySignalKey[key];
                    console.log("step 0.9 key:", key, "signal:", signal);
                    
                    if (key === undefined || key == "undefined") {
                        console.log("found undefined key");
                    } else {
                        continue;
                    }
                    
                    // add smds (pads without holes)
                    if (signal.smds && signal.smds.length > 0) {
                        
                        // make backup copy in case user wants to add them back in
                        if (!('smdsBackup' in signal)) {
                            signal.smdsBackup = signal.smds;
                        }
                        
                        delete signal.smds;
                        console.log("just deleted smds from signal:", signal);
                        
                        //signal.smds.forEach(function(smd) {    
                        //}, this);
                    }
                }
            } else {
                // put back backup copy if it exists because we modify the original
                // wire clipper paths if user chose to "clip wires", but we cheat by keeping
                // a backup copy in case they uncheck the box later
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    if (key !== undefined) continue;
                    var signal = this.clipperBySignalKey[key];
                    if (signal.smds && 'smdsBackup' in signal)
                        signal.smds = signal.smdsBackup;
                }
            }
            
            // Step 0.9. If user wants to clip wires out of SMDs do it at this step
            if ($('#com-chilipeppr-widget-eagle .use-smd-clipwire').is(':checked')) {
                
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var signal = this.clipperBySignalKey[key];
                    console.log("step 0.9 key:", key, "signal:", signal);
                    
                    // make backup copy of original signal.wire.clipper
                    if (!(signal.wire && signal.wire.clipper)) {
                        continue;
                    }
                    
                    if (!('clipperBackup' in signal.wire))
                        signal.wire.clipperBackup = signal.wire.clipper;
                    
                    // add smds (pads without holes)
                    if (signal.smds && signal.smds.length > 0) {
                        
                        signal.smds.forEach(function(smd) {    
                            
                            // we have each smd looping here, so just diff out this smd
                            // from each wire in this signal
                            if (signal.wire && signal.wire.clipper.length > 0) {
                                //signal.wire.clipper.forEach(function(path) {   
                                    console.log("removing smd path from wire path. smd:", smd, "wire path:", signal.wire);
                                
                                    signal.wire.clipper = this.getDiffOfClipperPaths(signal.wire.clipper, [smd.clipper]);
                                //}, this);
                            }
                            
                        }, this);
                    }
                }
            } else {
                // put back backup copy if it exists because we modify the original
                // wire clipper paths if user chose to "clip wires", but we cheat by keeping
                // a backup copy in case they uncheck the box later
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var signal = this.clipperBySignalKey[key];
                    if (signal.wire && 'clipperBackup' in signal.wire)
                        signal.wire.clipper = signal.wire.clipperBackup;
                }
            }

            
            // Step 1. Create a path for each signal that includes wires, pads,
            // smds, and vias
            console.log("doing step 1 of rendering");
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var signal = this.clipperBySignalKey[key];
                console.log("step 1 key:", key, "signal:", signal);
                var signalPaths = [];
                var signalPathsInflated = [];
                var signalPathsInflatedHalf = [];
                
                // add smds (pads without holes)
                if (signal.smds && signal.smds.length > 0) {
                    
                    signal.smds.forEach(function(smd) {    
                        signalPaths.push(smd.clipper);
                        
                        // decide whether to inflate smds or not based on user settings
                        var ip, ipHalf, ipConstraint;
                        if (true) {
                            ip = this.getInflatePath([smd.clipper], inflateSmdsBy);
                            //ipHalf = this.getInflatePath([smd.clipper], inflateSmdsBy / 2);
                        }  else {
                            ip = [smd.clipper];
                        }
                        ip.forEach(function(ipath) {
                            signalPathsInflated.push(ipath);
                        });
                        /*ipHalf.forEach(function(ipath) {
                            signalPathsInflatedHalf.push(ipath);
                        });*/
                        /*
                        if (key == "+5V") {
                            console.log("+3V smd:", smd);
                            this.drawClipperPaths([smd.clipper], 0xff0000, 0.99, debugZ);
                            //debugZ += 0.5;
                        }*/
                    }, this);
                }

                // add pads (have holes)
                if (signal.pads && signal.pads.length > 0) {
                    signal.pads.forEach(function(pad) {    
                        signalPaths.push(pad.clipper);
                        
                        // decide whether to inflate pads based on user settings
                        var ip, ipHalf;
                        if (true) {
                            ip = this.getInflatePath([pad.clipper], inflatePadsBy);
                            //ipHalf = this.getInflatePath([pad.clipper], inflatePadsBy / 2);
                        }  else {
                            ip = [smd.clipper];
                        }
                        ip.forEach(function(ipath) {
                            signalPathsInflated.push(ipath);
                        });
                        /*ipHalf.forEach(function(ipath) {
                            signalPathsInflatedHalf.push(ipath);
                        });*/
                    }, this);
                }
                
                // add vias
                if (signal.vias && signal.vias.length > 0) {
                    signal.vias.forEach(function(via) {    
                        signalPaths.push(via.clipper);
                        
                        // decide whether to inflate vias based on user settings
                        var ip, ipHalf;
                        if (true) {
                            ip = this.getInflatePath([via.clipper], inflateViasBy);
                            //ipHalf = this.getInflatePath([via.clipper], inflateViasBy / 2);
                        }  else {
                            ip = [smd.clipper];
                        }
                        ip.forEach(function(ipath) {
                            signalPathsInflated.push(ipath);
                        });
                        /*ipHalf.forEach(function(ipath) {
                            signalPathsInflatedHalf.push(ipath);
                        });*/
                    }, this);
                }

                // add wires
                if (signal.wire && signal.wire.clipper.length > 0) {
                    signal.wire.clipper.forEach(function(path) {    
                        signalPaths.push(path);
                        
                        // decide whether to inflate wires based on user settings
                        var ip, ipHalf;
                        if (true) {
                            // check orientation and if it's a hole deflate instead of inflate
                            if (ClipperLib.Clipper.Orientation(path)) {
                                // normal outer path
                                ip = this.getInflatePath([path], inflateWiresBy);
                                //ipHalf = this.getInflatePath([path], inflateWiresBy / 2);
                            } else {
                                // hole path
                                //console.warn("found hole path in signal wire. signal.wire:", signal.wire);
                                ip = this.getInflatePath([path], inflateWiresBy * -1);
                                //if (ClipperLib.Clipper.Orientation(ip)) {
                                    //console.warn("this deflated hole does not look like a hole anymore. huh?. ip:", ip);
                                    ClipperLib.Clipper.ReversePaths(ip);
                                //}
                                //ipHalf = this.getInflatePath([path], inflateWiresBy / 2 * -1);
                                //ipHalf.reverse();
                            }
                        }  else {
                            ip = [smd.clipper];
                        }
                        ip.forEach(function(ipath) {
                            signalPathsInflated.push(ipath);
                        });
                        /*ipHalf.forEach(function(ipath) {
                            signalPathsInflatedHalf.push(ipath);
                        });*/
                    }, this);
                }
                
                // add this signal path to overall paths
                var signalPathUnion = this.getUnionOfClipperPaths(signalPaths);
                signal.path = signalPathUnion;
                //if (key == "VSS") this.drawClipperPaths(signal.path, 0xff0000, 0.99, debugZ);
               
                // For pathInflated...
                console.log("signalPathsInflated:", signalPathsInflated);
                signal.pathInflated = this.getUnionOfClipperPaths(signalPathsInflated);
                //if (key == "VSS") this.drawClipperPaths(signal.pathInflated, 0xff0000, 0.99, 2);
                
                // TODO: If we start using this inflated half again
                //signal.pathInflatedHalf = this.getUnionOfClipperPaths(signalPathsInflatedHalf);
                
                //debugZ += 1;
                
            }
            console.log("new clipperBySignalKey with overallPath:", this.clipperBySignalKey);
            
            
            // Step 1.5. Clip each fully inflated signal by the half inflated signal so
            // that we can try to get no overlap and instead end up with half an overlap.
            /*
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var signal = this.clipperBySignalKey[key];
                
                for (var i2 = 0; i2 < keys.length; i2++) {
                    if (i == i2) continue; // skip ourselves
                    var key2 = keys[i2];
                    var signal2 = this.clipperBySignalKey[key2];
                    
                    signal.pathInflated = this.getDiffOfClipperPaths(signal.pathInflated, signal2.pathInflatedHalf);
                }
            }
            */
            
            // Only do this step if user asked for Magic Wand
            // Step 1.5: Inflate paths with half constraint
            // now do magic wand
            if (isMagicWand) {
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var signal = this.clipperBySignalKey[key];
                    console.log("step 1.5 key:", key, "signal:", signal);
                    
                    var signalPathsInflateConstraint = [];
                    
                    // create constraint paths, which is all the other paths minus
                    // this one
                    var constraintPaths = [];
                    for (var i2 = 0; i2 < keys.length; i2++) {
                        if (i == i2) continue;
                        var key = keys[i2];
                        var signal2 = this.clipperBySignalKey[key];
                        signal2.path.forEach(function(path) {
                            constraintPaths.push(path);
                        });
                    }
                    
                    // get inflated constraint path for this signal
                    if (i == 0) {
                        console.log("doing inflate with constraint for i:", i);
                        // create constraint
                        var ipc = this.getInflatePathWithConstraint(signal.path, inflateBy, constraintPaths);
                        ipc.forEach(function(ipath) {
                            signalPathsInflateConstraint.push(ipath);
                        });
                        
                        
                        // add this inflatedConstrained signal path to overall paths
                        var signalPathUnion = this.getUnionOfClipperPaths(signalPathsInflateConstraint);
                        signal.pathInflatedConstrained = signalPathUnion;
                        signal.pathInflated = signalPathUnion;
                    }
                    
                }
            }
            
            
            // Step 2. If a signal has a poly, remove from the polys the other paths
            // from step 1. We should actually remove the inflated paths of the
            // step 1 poly. That will leave us with a clipped poly
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var signal = this.clipperBySignalKey[key];
                //console.log("signal:", signal);
                
                var signalPaths = [];
                
                // deal with clipping polygons in this signal by clipping
                // them with any of the signals from other layers
                if (signal.poly && signal.poly.polys.length > 0) {
                    
                    var polyCtr = 0;
                    signal.poly.polys.forEach(function(poly) {
                        
                        console.log("poly:", poly, "signal:", signal);

                        // create our start of new path
                        poly.clipperWithOtherSignalsRemoved = ClipperLib.JS.Clone([poly.clipper]);

                        if (poly.pour == "cutout") {
                            //console.error("need to create cutout algo. poly:", poly);
                            // skip the cutout cuz nothing to render, instead this poly
                            // will get used to remove from real polys in other times thru
                            // this loop
                            //console.warn("found a cutout poly. still need to remove other signals");
                            //return;
                        }
                            
                        // clip the poly by removing all paths from other signals
                        // loop thru all other inflated signal paths
                        for (var i2 = 0; i2 < keys.length; i2++) {
                            if (i == i2) continue; // skip ourselves
                            var key2 = keys[i2];
                            var signal2 = this.clipperBySignalKey[key2];
                            poly.clipperWithOtherSignalsRemoved = this.getDiffOfClipperPaths(poly.clipperWithOtherSignalsRemoved, signal2.pathInflated);
                            
                            // cutout other polys in the entire document from this poly
                            // as well but only if their rank is less than this poly's rank
                            if (signal2.poly && signal2.poly.polys.length > 0) {
                                var poly1Rank = 1;
                                if (poly.rank > 1) poly1Rank = poly.rank;
                                signal2.poly.polys.forEach(function(poly2) {
                                    var poly2Rank = 1;
                                    if (poly2.rank > 1) poly2Rank = poly2.rank;
                                    if (poly2Rank < poly1Rank) {
                                        // that means poly2 is a stronger rank than me
                                        // so we need to cut it out of me
                                        console.log("found poly that is stronger rank, so cut it out");
                                        poly.clipperWithOtherSignalsRemoved = this.getDiffOfClipperPaths(poly.clipperWithOtherSignalsRemoved, [poly2.clipper]);
                                    }
                                }, this);
                                
                                // also handle cutout polys, where ranks aren't relevant
                                signal.poly.polys.forEach(function(poly2) {
                                    if (poly2.pour == "cutout") {
                                        console.log("found poly that should cutout from other polys. poly2:", poly2);
                                        poly.clipperWithOtherSignalsRemoved = this.getDiffOfClipperPaths(poly.clipperWithOtherSignalsRemoved, [poly2.clipper]);                     
                                    }
                                }, this);
                            }
                        }
                        
                        // additionally, this signal may have multiple polys and they
                        // may be setup for cutout of this one, so scan thru those
                        // and clip this poly if the other poly is asking us to
                        console.log("about to trim any polys in this signal with other polys in this signal that are cutouts");
                        if (poly.pour != "cutout") {
                            var polyCtr2 = 0;
                            signal.poly.polys.forEach(function(poly2) {
                                if (polyCtr == polyCtr2) return; // we don't want to analyze ourselves
                                console.log("poly2:", poly2, "signal:", signal);
                                if (poly2.pour == "cutout") {
                                    console.log("found poly that should cutout from other polys. poly2:", poly2);
                                    poly.clipperWithOtherSignalsRemoved = this.getDiffOfClipperPaths(poly.clipperWithOtherSignalsRemoved, [poly2.clipper]);                     
                                }
                                polyCtr2++;
                                
                            }, this);
                        }
                         
                        //this.drawClipperPaths(poly.clipperWithOtherSignalsRemoved, 0xff0000, 0.99, debugZ);
                        //debugZ += 5;
                        
                        polyCtr++;
                        
                    }, this);
                }
            }

            // Step 2.5: Also clip polys by the dimensions, meaning, don't let any poly
            // go beyond the dimensions of the board.
            console.group("cutPolyByDimensions")
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var signal = this.clipperBySignalKey[key];
                
                if (signal.poly && signal.poly.polys.length > 0) {
                    
                    signal.poly.polys.forEach(function(poly) {
                        
                        //put all dimantion paths in single clipper array
                        var cdp = [];
                        for(var n=0; n<this.clipperDimensionInfo.length; n++){
                            var cdi = this.clipperDimensionInfo[n];
                            if(cdi.type != 0) continue;
                            cdp.push(this.clipperDimension.slice(cdi.start, cdi.end));
                        }
                        var regionOutside = this.getDiffOfClipperPaths(poly.clipperWithOtherSignalsRemoved, cdp);
                        if (regionOutside != null && regionOutside.length > 0) {
                            // we found a region outside dimensions, clip it off
                            poly.clipperWithOtherSignalsRemoved = this.getDiffOfClipperPaths(poly.clipperWithOtherSignalsRemoved, regionOutside);
                        }
                        //this.drawClipperPaths(poly.clipperWithOtherSignalsRemoved, 0xff0000, 0.99, debugZ);
                        //debugZ += 5;
                    }, this);
                }
            }
            console.groupEnd()
            // Step 3. Now deal with removing smds/pads from the polys
            console.log("doing step 3");
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var signal = this.clipperBySignalKey[key];
                //console.log("signal:", signal);
                
                var signalPaths = [];
                
                // deal with clipping polygons in this signal by clipping
                // them with any of the signals from other layers
                if (signal.poly && signal.poly.polys.length > 0) {
                    
                    signal.poly.polys.forEach(function(poly) {
                        
                        console.log("poly:", poly, "signal:", signal);
                        //this.drawClipperPaths(poly.clipperWithOtherSignalsRemoved, 0xff0000, 0.9, debugZ);
                        //debugZ += 1;
                        
                        if (poly.pour == "cutout") {
                            //console.error("need to create cutout algo. poly:", poly);
                            poly.finalClipper = poly.clipperWithOtherSignalsRemoved
                        }
                        
                        
                        // handle thermals
                        if (poly.thermals == "no") {
                            //signalPaths.push(poly.clipper);
                            //poly.finalClipper = [poly.clipper];
                            poly.finalClipper = poly.clipperWithOtherSignalsRemoved
                        
                        } else {
                            // they want thermals
                            //console.warn("need to calculate thermals");
                            // do thermals on pads and smds only, not on wires or vias
                            // remove pads/smds from poly to create holes in the poly
                            // then inflate the hole by inflateMillPathBy?
                            // then add stroked lines as cross hairs across hole
                            // then re-add pad/smd?
                            
                            // create a path with holes, we may not get any
                            // based on the if statements below
                            var polyPathWithHoles = poly.clipperWithOtherSignalsRemoved;
                            //this.drawClipperPaths(polyPathWithHoles, 0x00ff00, 0.9, debugZ);
                            //debugZ += 0.1;
                            
                            // remove the thermal shapes of smds from poly
                            if (signal.smds && signal.smds.length > 0) {
                                
                                // let's do alternate approach. sometimes smds can
                                // overlap. it's not common, but on LED's for instance, multiple
                                // smds are near each other to create a more unique shape for
                                // the smd. so we need to union these and then do the thermal
                                // for each polygon region, rather than relying on the smd's
                                // themselves to indicate separation and independent thermals
                                
                                var newSmdPaths = [];
                                signal.smds.forEach(function(smd) {   
                                    newSmdPaths.push(ClipperLib.JS.Clone(smd.clipper));
                                }, this);
                                
                                var newSmdPathsUnion = this.getUnionOfClipperPaths(newSmdPaths);
                                newSmdPathsUnion.forEach(function(path) {
                                    var cutoutPath = this.createThermalCutoutsFromSmd({clipper: path}, poly, inflateSmdsBy); 
                                    // deflate the cutoutPath to ensure we don't run over the smd
                                    //cutoutPath = this.getInflatePath(cutoutPath, (inflateBy / 4) * -1);
                                    
                                    // remove the cutoutPath from poly
                                    polyPathWithHoles = this.getDiffOfClipperPaths(polyPathWithHoles, cutoutPath);
                                }, this);
                                
                            } 
                            
                            // remove the thermals shapes of pads from poly
                            if (signal.pads && signal.pads.length > 0) {
                                
                                signal.pads.forEach(function(pad) {   
                                    
                                    console.log("removing thermal cutouts from poly. pad:", pad, "poly:", poly);
                                    
                                    var cutoutPath = this.createThermalCutoutsFromSmd(pad, poly, inflatePadsBy); 
                                    
                                    // deflate the cutoutPath to ensure we don't run over the smd
                                    //cutoutPath = this.getInflatePath(cutoutPath, inflateBy * -1);
                           
                                    // remove the cutoutPath from poly
                                    polyPathWithHoles = this.getDiffOfClipperPaths(polyPathWithHoles, cutoutPath);
                                         
                                }, this);
                            } 
                            
                            poly.finalClipper = polyPathWithHoles;
                            
                        }
                        
                        // debug. draw the final poly
                        //this.drawClipperPaths(poly.finalClipper, 0xff0000, 0.99, debugZ);
                        //debugZ += 2;
                        
                    }, this);
                }
            }

            // Dispenser Code to render drops
            // TODO. Need to fire off pubsub so others, like Frank, can inject
            // here. Or, better yet let's get a more generic way of letting 3rd
            // party add-ons add stuff
            
            // Step 4. We now have a gorgeous clipperBySignalKey with polys that are
            // correct with all stuff removed. We have wires, pads, smds, vias.
            // We now need to union each signal to one final master union path.
            // Then we'll render those paths.
            console.log("doing step 4, final combining of each signal path");
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var signal = this.clipperBySignalKey[key];
                console.log("key:", key, "signal:", signal);
                
                //signal.finalPath = ClipperLib.JS.Clone();
                
                // take main path and add poly
                if (signal.poly && signal.poly.polys.length > 0) {
                    signal.poly.polys.forEach(function(poly) {
                        console.log("adding final poly. signal.pathInflated:", signal.pathInflated, "poly.finalClipper:", poly.finalClipper);
                        
                        // don't add cutout polys, ignore them, they're just for clipping
                        // purposes
                        if (poly.pour == "cutout") {
                            return;
                        }

                        // wipe out the poly region from the signal.pathInflated, meaning
                        // drop all the original smds/pads/vias/wires inside that poly because
                        // we have our modified poly ready to put there and don't want 
                        // anything interfering with it
                        
                        // however, to avoid problems, deflate the poly a tiny bit to do this
                        // so that when we do the final union we are guaranteed overlap
                        
                        // we could possibly have a poly without signals
                        if (signal.pathInflated && signal.pathInflated.length > 0) {
                            var barelyDeflatedPoly = this.getInflatePath([poly.clipper], -0.00010);
                            signal.pathInflated = this.getDiffOfClipperPaths(signal.pathInflated, barelyDeflatedPoly);
                            poly.finalClipper.forEach(function(path) {
                                signal.pathInflated.push(path);
                            });
                        } else {
                            // just use the poly as final path
                            signal.pathInflated = poly.finalClipper;
                        }
                    }, this);
                    // now union the main path to the poly(s)
                    signal.pathInflated = this.getUnionOfClipperPaths(signal.pathInflated);
                }
                
                signal.pathInflated.forEach(function(path) {
                    paths.push(path);
                });
                //var threePath = this.drawClipperPaths(signal.pathInflated, 0xff0000, 0.3, 3);
                //this.threePathEndMillArr.push(threePath);
            }
            
            // Step 5.
            // Now we should have a full signal path for each signal where we
            // have wires, smds, pads, and vias as well as the polygons where the
            // polygon is cutout cleanly to represent what you would see in Eagle
            
            // Let's do an additional step and remove redundant lines so that we don't end
            // up with our endmill traversing the same path twice
            
            // We want full cycles around each signal to avoid inaccuracy in the milling,
            // so we likely want to overreach the path by one line segment (or even measure
            // at least 2mm into the beginning of each path, or 10x the endmill size)
            // Find the signal with the most amount of paths/points and end with that
            // because we may have a signal layer with a ground pour, or +V pour and that
            // will contain the majority of moves on it's own. But, start with shortest single
            // path and look to other signals to see if there are redundant lines and
            // remove them
            
            // Sort shortest path first
            /*
            paths.sort(function (a, b) {
                if (a.length > b.length) {
                    return 1;
                }
                if (a.length < b.length) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
            */

            // make a fake duplicate
            //paths.push(ClipperLib.JS.Clone(paths[0]));

            // Sort longest path first
            paths.sort(function (a, b) {
                if (a.length > b.length) {
                    return -1;
                }
                if (a.length < b.length) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            });
            
            // REDUNDANT PATH REDUCTION
            // Should really get this working to cut mill time in half
            if (false) {
            // make all paths be outer orientation
            for (var i = 0; i < paths.length; i++) {
                var path = paths[i];
                var orientation = ClipperLib.Clipper.Orientation(path);
                if (orientation == false) {
                    // it's a hole, reverse it
                    console.log("found hole. reversing it.");
                    path = path.reverse();
                }
            }

            console.log("doing redundant line ctr");
            var redundantLineCtr = 0;
            for (var path1Ctr = 0; path1Ctr < paths.length; path1Ctr++) {
                var path1 = paths[path1Ctr];
                for (var i = 0; i < path1.length; i++) {
                    var pt1 = path1[i];
                    var pt2 = (i+1 < path1.length) ? path1[i+1] : path1[0];
                    for (var path2Ctr = 0; path2Ctr < paths.length; path2Ctr++) {
                        if (path2Ctr == path1Ctr) continue; // skip myself
                        var path2 = paths[path2Ctr];
                        for (var i2 = 0; i2 < path2.length; i2++) {
                            var pt2pt1 = path2[i2];
                            var pt2pt2 = (i2+1 < path2.length) ? path2[i2+1] : path2[0];
                            if (pt1 != null && pt2 != null && pt2pt1 != null && pt2pt2 != null && pt1.X == pt2pt1.X && pt1.Y == pt2pt1.Y && pt2.X == pt2pt2.X && pt2.Y == pt2pt2.Y) {
                                //console.log("found redundant path. path1Ctr:", path1Ctr, "path2Ctr:", path2Ctr);    
                                // try setting to null
                                pt1 = null;
                                path1[i] = null;
                                pt2.markedForDelete = true;
                                redundantLineCtr++;
                            }
                        }
                    }
                }
            }
            console.log("num of redundantLineCtr:", redundantLineCtr);
            
            // now loop thru and remove points that are nulls
            var removedPtsCtr = 0;
            var removedFromMarked = 0;
            var newPaths = [];
            for (var path1Ctr = 0; path1Ctr < paths.length; path1Ctr++) {
                var path1 = paths[path1Ctr];
                var newPath1 = [];
                for (var i = 0; i < path1.length; i++) {
                    var pt = path1[i];
                    if (pt == null)
                        removedPtsCtr++;
                    else if (pt.markedForDelete)
                        removedFromMarked++;
                    else
                        newPath1.push(pt);
                }
                if (newPath1.length > 0)
                    newPaths.push(newPath1);
            }
            paths = newPaths;
            console.log("removed all null pts. removedPtsCtr:", removedPtsCtr, "removedFromMarked:", removedFromMarked);
            } // end redundant path removal
            
            if($('#com-chilipeppr-widget-eagle .AvoidTraceBoardDimensions').prop ("checked")){
                for(var i=0; i<this.clipperDimensionInfo.length;i++){
                    var cdi = this.clipperDimensionInfo[i];
                    if(cdi.type != 0) continue;
                    var p = 0;
                    while(p<paths.length) {
                        var dp = this.getDiffOfClipperPaths(
                        [this.clipperDimension.slice(cdi.start, cdi.end)], [paths[p]]);
                        if(dp.length == 0) paths.splice(p,1);
                        p++;
                    }
                }
            }

            // remove redundant paths
            this.debugZ = 2;
            //paths = this.redundantPathRemoval(paths);
            
            // Now draw the paths
            var zLevel = 0.1;
            paths.forEach(function(path) {
                var threePath = this.drawClipperPaths([path], 0x0000ff, 0.4, zLevel, 0, true);
                //zLevel += 5;
                //zLevel += 0.1;
                this.threePathEndMill.push(threePath);
            }, this);
            
            // See if user wants to show actual endmill path as a cyan mesh
            zLevel = 5;
            if (isShow) {
                this.actualEndmill = parseFloat($('#com-chilipeppr-widget-eagle .actual-endmill-size').val());
                var localInflateBy = this.actualEndmill / 2;
                var trueInflateBy = this.actualEndmill;
                
                //var pathDeflatedActualArr = [];
                //var pathInflatedActualArr = [];
                
                // loop thru all paths and draw a mesh stroke
                // around the path with opacity set, such that when
                // multiples meshes are overlaid, their colors are darker
                // to visualize the toolpath. that means creating normals
                // for each pt and generating triangles to create mesh
                
                var group = new THREE.Object3D();
                var pathCtr = 0;
                
                var mat = new THREE.MeshBasicMaterial({
                    color: 0x00ffff,
                    transparent: true,
                    opacity: 0.99,
                    side: THREE.DoubleSide,
                    depthWrite: false
                });
                var mat2 = new THREE.MeshBasicMaterial({
                    color: 0x00ffff,
                    transparent: true,
                    opacity: 0.99,
                    depthWrite: false
                });
                
                paths.forEach(function(path) {
                    //if (pathCtr > 0) return;
                    //path = [{X:10, Y:10}, {X:20, Y:10}, {X:20, Y:20}];
                    //var geometry = new THREE.Geometry();
                    
                    
                    // create a clipper stroke path for each line segment
                    // we won't create one for the last pt because there's no line
                    // after it
                    var clipperStrokes = [];
                    var csThisPath = [];
                    //console.log("calculating stroke paths for each path");
                    for (var pi = 0; pi < path.length; pi++) {
                        
                        var pt = path[pi];
                        //var pt2 = (pi + 1 < path.length) ? path[pi + 1] : null;
                        var pt2 = (pi + 1 < path.length) ? path[pi + 1] : path[0];

                        if (pt2 != null) {
                            var clipperStroke = this.addStrokeCapsToLine(pt.X, pt.Y, pt2.X, pt2.Y, localInflateBy * 2);
                            //clipperStrokes.push(clipperStroke);
                            if (clipperStroke.length > 1) console.warn("got more than 1 path on clipperStroke");
                            csThisPath.push(clipperStroke[0]);
                            //this.drawClipperPaths(clipperStroke, 0xff0000, 0.99, 0);
                        }
                        
                    }
                    var csUnion = this.getUnionOfClipperPaths(csThisPath);
                    //console.log("drawing csUnion:", csUnion);
                    
                    if (!isSolid) {
                        var threeObj = this.drawClipperPaths(csUnion, 0x00ffff, 0.5, 0);
                        //this.sceneAdd(group);
                        this.threePathEndMillArr.push(threeObj);
                    }
                    
                    // This is SUPER SLOW cuz of the triangle calculation
                    if (isSolid) {
                        
                        //if (csUnion.length > 1) console.warn("got more than 1 path on union");
                        // investigate holes
                        var csUnionHoles = [];
                        var csUnionOuter = [];
                        var ctr = 0;
                        csUnion.forEach(function(path) {
                            if (ClipperLib.Clipper.Orientation(path)) {
                                // do nothing.
                                //console.log("outer path:", path);
                                csUnionOuter.push(path);
                            } else {
                                //console.warn("found a hole:", path);
                                csUnionHoles.push(path);
                            }
                            ctr++;
                        }, this);
                        if (csUnionOuter.length > 1) console.warn("got more than 1 outer path");
                        var mesh = this.createClipperPathsAsMesh(csUnionOuter, 0x00ffff, 0.2, csUnionHoles);
                        this.sceneAdd(mesh);
                        this.threePathEndMillArr.push(mesh);
                    }
                    //clipperStrokes.push(csUnion[0]);
                    
                    
                    // now subtract the subsequent stroke path from each line so we get
                    // no overlap
                    //console.log("subtracting subsequent path from each");
                    /*
                    var geo = new THREE.Geometry();
                    var clipperStrokesDiffed = [];
                    var geometries = [];
                    for (var pi = 0; pi < path.length - 1; pi++) {
                        var cs = clipperStrokes[pi];
                        var cs2 = (pi + 1 < path.length) ? clipperStrokes[pi + 1] : null;
                        
                        if (cs2 != null) {
                            var clipperStrokeDiff = this.getDiffOfClipperPaths(cs, cs2);
                            //if (clipperStrokeDiff.length > 1) console.warn("got more than 1 path doing a diff on stroke. should not happen.");
                            clipperStrokesDiffed.push(clipperStrokeDiff[0]);
                            var mesh = this.createClipperPathsAsMesh(clipperStrokeDiff, 0x00ffff, 0.2);
                            //console.log("going to merge mesh:", mesh);
                            if (mesh instanceof THREE.Object3D) {
                                // loop thru children
                                mesh.children.forEach(function(obj) {
                                    //obj.updateMatrix();
                                    //geo.merge(obj.geometry);
                                    
                                    geometries.push(obj.geometry);
                                });
                            } else {
                                // merge this geometry with previous
                                //mesh.updateMatrix();
                                //geo.merge(mesh.geometry);
                                geometries.push(mesh.geometry);
                            }
                            //geo.updateMatrix();
                            //this.sceneAdd(mesh);
                        }
                    }
                    */
                    
                    /*
                    // we now have all our geometries and we want to merge them for efficiency
                    // but take the first, then last and work way to middle
                    for (var gi = 0; gi < 3; gi++) { //geometries.length
                        
                        console.log("merging geo:", geo, "geo2:", geometries[gi]);
                        if (gi == 0) geo = geometries[gi];
                        else geo.merge(geometries[gi]);
                        console.log("after merge geo:", geo);
                        geo.mergeVertices();
                        console.log("after merge2 geo:", geo);
                        //geo.merge(geometries[geometries.length - 1 - gi]);
                    }
                    var shapeMesh = new THREE.Mesh(geo, mat);
                    this.sceneAdd(shapeMesh);
                    */
                    
                    // we drew all diffed paths, but the last segment did not get diffed
                    // so draw that as well
                    //console.log("drawing last stroke");
                    /*
                    var lastStroke = clipperStrokes[clipperStrokes.length - 1];
                    var mesh = this.createClipperPathsAsMesh(lastStroke, 0x00ffff, 0.2);
                    this.sceneAdd(mesh);
                    */
                    
                    pathCtr++;
                }, this);
                
                //this.sceneAdd(group);
                //this.threePathEndMillArr.push(group);
                //this.threePathDeflatedActualArr.push( group );
            }
            
            // Export Gcode
            this.paths = paths;
            setTimeout(this.exportGcode.bind(this), 500);
            
            if (callback) {
                console.log("there was a callback after final drawing of board.");
                callback();
            }
            //console.log("paths:", paths);
            
            // fire off the pubsub signal indicating we're done rendering
            chilipeppr.publish('/' + this.id + '/afterToolPathRender', this);

            console.log("done rendering Eagle BRD");
        },
        getInflatePathWithConstraint: function(paths, inflateBy, constraints) {
            
            // This method will inflate a path, but not allow the inflate to go
            // beyond half the distance to the paths in contraints
            
            console.log("getInflatePathWithConstraint. paths:", paths, "inflateBy", inflateBy, "constraints:", constraints);
            
            var newPaths = ClipperLib.JS.Clone(paths);

            // draw the path we are inflating
            //this.drawClipperPaths(newPaths, 0x0000ff, 0.99, 3);
            
            // draw the constraints
            var threeObj = this.drawClipperPaths(constraints, 0xff0000, 0.99, 3);
            this.threePathEndMillArr.push(threeObj);
            
            // Step 0. Generate normals for the path.
            for (var i = 0; i < newPaths.length; i++) {
                var path = newPaths[i];
                                
                // iterate through points and generate normals
                for (var ptIndex = 0; ptIndex < path.length; ptIndex++) {
                    var pt = path[ptIndex];
                    pt.normals = this.getNormals(ptIndex, path);
                }
            }
            
            // Step 1. Build a Three.js object of the constraints as a per line structure
            // so when we raycast we get the individual line. I do think this could be
            // done as monolithic lines for better efficiency, but it may not help.
            var constraintGroup = new THREE.Group();
            var constraintLines = new THREE.Group();
            var cLineMat = new THREE.LineBasicMaterial({
                color: 0xff0000
            });
            for (var i = 0; i < constraints.length; i++) {
                var cPath = constraints[i];
                var groupOfLines = this.getThreeJsGroupOfLinesForPath(cPath, 0xff0000);
                constraintGroup.add(groupOfLines);
                
                // create a big line group too cuz more efficient to raycast against
                var lineGeo = new THREE.Geometry();
                for (var i2 = 0; i2 < cPath.length; i2++) {
                    var cpt = cPath[i2];
                    lineGeo.vertices.push(new THREE.Vector3(cpt.X, cpt.Y, 0));
                }
                // close it by adding first pt again
                lineGeo.vertices.push(new THREE.Vector3(cPath[0].X, cPath[0].Y, 0));
                var cLine = new THREE.Line(lineGeo, cLineMat);
                constraintLines.add(cLine);
            }
            var group2 = constraintGroup.clone();
            group2.position.setZ(3);
            console.log("group2:", group2);
            //group2.material.color = 0xff0000;
            this.sceneAdd(group2);
            
            // Step 2. Build normals for each constraint line because we have to project
            // those normals onto our paths to see if we need to add extra points to better
            // follow the curvature of our environment
            for (var i = 0; i < constraints.length; i++) {
                var cPath = constraints[i];
                for (var ptIndex = 0; ptIndex < cPath.length; ptIndex++) {
                    var cPt = cPath[ptIndex];
                    cPt.normals = this.getNormals(ptIndex, cPath);
                }
            }
            
            // Step 3. Loop thru paths and look at each line of the path and see
            // if the constraints project onto us, meaning we'll raycast 2 normals
            // for each point on the constraint lines (so this is a ton of CPU 
            // being chewed up here) and if there is an intersection we'll add
            // that intersecting point to our main path so when we inflate
            // outward we have more points at good spots to match curvature
            // of constraint lines (i.e. let the environment around us influence
            // our inflate shape)
            var lineMat = new THREE.LineBasicMaterial({
                color: 0x0000ff,
                transparent: true,
                opacity: 0.9
            });
            var lineMat2 = new THREE.LineBasicMaterial({
                color: 0x00ff99,
                transparent: true,
                opacity: 0.9
            });
            var debugZ = 3;
            for (var i = 0; i < newPaths.length; i++) {
                var path = newPaths[i];
                
                //if (i != 1) continue;
                
                var newPath = [];
                
                // iterate through points (and lines)
                for (var ptIndex = 0; ptIndex < path.length; ptIndex++) {
                    //if (ptIndex > 10) continue;
                    
                    var pt = path[ptIndex];
                    var pt2 = (ptIndex + 1 < path.length) ? path[ptIndex + 1] : path[0];
                    
                    // we will essentially generate a new line here, meaning we'll
                    // rebuild a new path where we will at least get the same
                    // points we started with if there are no intersections from
                    // the contraints raycasted onto us, but if there are new points
                    // raycasted onto us, we'll add them into the array
                    pt.orig = true;
                    pt.origPtIndex = ptIndex;
                    newPath.push(pt);
                    
                    var lineGeo = new THREE.Geometry();
                    var ptVector = new THREE.Vector3(pt.X, pt.Y, 0);
                    lineGeo.vertices.push(ptVector);
                    lineGeo.vertices.push(new THREE.Vector3(pt2.X, pt2.Y, 0));
                    var myLineObj = new THREE.Line(lineGeo, (ptIndex % 2 == 0) ? lineMat : lineMat2);
                    var myLine = new THREE.Group();
                    myLine.add(myLineObj);
                    
                    // DEBUG. Draw it
                    var myLine2 = myLine.clone();
                    myLine2.position.setZ(debugZ)
                    this.threePathEndMillArr.push(myLine2);
                    this.sceneAdd(myLine2);
                    //debugZ += 0.2;
                    
                    // we could get some new points here from the constraints raycasted
                    // onto this line. if so keep an array. then de-dupe and sort by distance.
                    // then add to line
                    var newPts = [];
                    
                    // see if the environment intersects with me
                    for (var ci = 0; ci < constraints.length; ci++) {
                        //if (ci > 0) continue;
                        var cPath = constraints[ci];
                       
                        for (var cptIndex = 0; cptIndex < cPath.length; cptIndex++) {
                            //if (ptIndex != 0 && ptIndex != 34) continue;
                            var cpt = cPath[cptIndex];
                            
                            // project normal to see if it intersects with myLine
                            //console.log("projecting normal to see if it intersects with myLine. cpt:", cpt);
                            //if (i == 1 && ptIndex == 0) this.drawNormal(cpt.normals.n1, cpt, inflateBy * 2, 0xff0000, 0.1, 2.9);
                            //if (i == 1 && ptIndex == 0) this.drawNormal(cpt.normals.n2, cpt, inflateBy * 2, 0xff9900, 0.1, 2.9);
                            //if (ptIndex == 34) {
                            var rc1 = this.getIntersection(cpt, cpt.normals.n1, myLine, inflateBy * 2, 0xff0000);
                            // if we get an intersect, we want to use this ray but
                            // in reverse to create our inflate
                            if (rc1.length > 0) {
                                var iPt = rc1[0];
                                //console.log("found intersection of constraints onto myLine. ptIndex for myLine:", ptIndex, "rc1:", iPt);
                                
                                // reverse direction of the ray
                                var newDir = {X:cpt.normals.n1.X * -1, Y:cpt.normals.n1.Y * -1};
                                var newPt = {
                                    X:iPt.point.x, 
                                    Y:iPt.point.y,
                                    normal: {
                                        dir: newDir,
                                        dist: iPt.distance / 2
                                    }
                                };
                                this.drawNormal(newDir, newPt, iPt.distance / 2, 0x0000ff, 0.7, 3);
                                // push this point onto newPath
                                newPts.push(newPt);
                            }
                            var rc2 = this.getIntersection(cpt, cpt.normals.n2, myLine, inflateBy * 2, 0xff9900);
                            if (rc2.length > 0) {
                                var iPt = rc2[0];
                                //console.log("found intersection of constraints onto myLine. ptIndex for myLine:", ptIndex, "rc2:", iPt);
                                
                                // reverse direction of the ray
                                var newDir = {X:cpt.normals.n2.X * -1, Y:cpt.normals.n2.Y * -1};
                                var newPt = {
                                    X:iPt.point.x, 
                                    Y:iPt.point.y,
                                    normal: {
                                        dir: newDir,
                                        dist: iPt.distance / 2
                                    }
                                };
                                this.drawNormal(newDir, newPt, iPt.distance / 2, 0x0066ff, 0.7, 3);
                                // push this point onto newPath
                                newPts.push(newPt);

                            }   
                            
                        }
                        
                    }
                    // done looking at contraint paths and points
                    
                    // now that we have our newPts for myLine, we must de-dupe, then sort
                    // by distance
                    
                    // de-dupe
                    if (newPts.length > 0) {
                        //console.log("newPts prior to de-dupe:", newPts);
                        newPtsDeDupe = this.uniqBy(newPts, JSON.stringify);
                        //console.log("newPts after de-dupe:", newPtsDeDupe);
                        
                        // sort by distance 
                        // (also toss any newPt that matches the first point of myLine
                        // or the last point of myLine)
                        ptVector = new THREE.Vector3(pt.X, pt.Y, 0);
                        var newPts2 = [];
                        newPts.forEach(function(newPt) {
                            
                            // check if this point matches the start/end of this line
                            // and if so, toss it
                            if (newPt.X == pt.X && newPt.Y == pt.Y) return;
                            if (newPt.X == pt2.X && newPt.Y == pt2.Y) return;
                            
                            var newPtVector = new THREE.Vector3(newPt.X, newPt.Y, 0);
                            newPt.dist = ptVector.distanceTo(newPtVector);
                            newPts2.push(newPt);
                        });
                        newPts2.sort(function (a, b) {
                            if (a.dist > b.dist) {
                                return 1;
                            }
                            if (a.dist < b.dist) {
                                return -1;
                            }
                            // a must be equal to b
                            return 0;
                        });
                        
                        // now push these new points
                        console.log("newPts after removing if start/end pt and sorting by distance. newPts:", newPts2);
                        newPts2.forEach(function(newPt2) {
                            //newPath.push({X:newPt2.X, Y:newPt2.Y});
                            newPath.push(newPt2);
                        });
                    }
                }
                
                // replace this path with our newpath
                console.log("replacing old path with N points:", path.length, " with newPath with N points:", newPath.length, "newPath:", newPath);
                newPaths[i] = newPath;
                
            }
            
            // WARNING. May have to eliminate points/rays from step above that are the
            // opposite direction of outward facing paths. I don't want any inward facing
            // normals/rays. However, they may get eliminated automatically in the union
            // operation at the end of the process
            
            // Step 4. Now that we have all the points we need on our main
            // paths. Let's inflate now, but inflate intelligently, i.e don't
            // inflate beyond half the ray intersection of each normal
            for (var i = 0; i < newPaths.length; i++) {
                var path = newPaths[i];
                
                //if (i != 1) continue;
                
                var inflatedPath = [];
                
                // iterate through points (and lines)
                for (var ptIndex = 0; ptIndex < path.length; ptIndex++) {
                    //if (ptIndex > 10) continue;
                    
                    var pt = path[ptIndex];
                    var pt2 = (ptIndex + 1 < path.length) ? path[ptIndex + 1] : path[0];
                    
                    // draw shape from normal1 to normal2 to any points on our line up to,
                    // but not including pt2's normal1
                    console.log("drawing shape for ptIndex:", ptIndex, "pt:", pt);
                    
                    
                    if (pt.orig) {
                        
                        // this is an original point, render the two normals
                        var n1Ray = new THREE.Ray(pt.normals.origin, pt.normals.n1.dir);
                        var n2Ray = new THREE.Ray(pt.normals.origin, pt.normals.n2.dir);
                        // project the ray outward to see if it intersects with constraints
                        // if it does we nee to shorten it, otherwise use the standard length
                        var rc1 = this.getIntersection(pt, pt.normals.n1, constraintLines, inflateBy * 2, 0xff0000);
                        var arrowHelper = new THREE.ArrowHelper(pt.normals.n1.dir, pt.normals.origin, inflateBy * 2, 0xff0000);
                        this.threePathEndMillArr.push(arrowHelper);
                        this.sceneAdd(arrowHelper);
                        var n1Pt;
                        if (rc1.length > 0) {
                            // we hit a constraint
                            var hitObj = rc1[0]; // use closest point we hit
                            console.log("rc1 hitObj:", hitObj);
                            n1Pt = n1Ray.at(hitObj.distance / 2);
                        } else {
                            // we did not hit constraint, so use normal inflation
                            n1Pt = n1Ray.at(inflateBy);
                        }
                        
                        var rc2 = this.getIntersection(pt, pt.normals.n2, constraintLines, inflateBy * 2, 0xff0000);
                        var arrowHelper = new THREE.ArrowHelper(pt.normals.n2.dir, pt.normals.origin, inflateBy * 2, 0xff9900);
                        this.threePathEndMillArr.push(arrowHelper);
                        this.sceneAdd(arrowHelper);
                        var n2Pt;
                        if (rc2.length > 0) {
                            // we hit a constraint
                            var hitObj = rc2[0]; // use closest point we hit
                            console.log("rc2 hitObj:", hitObj);
                            n2Pt = n2Ray.at(hitObj.distance / 2);
                        } else {
                            // we did not hit constraint, so use normal inflation
                            n2Pt = n2Ray.at(inflateBy);
                        }
                        
                        // order here is important. create winding triangles
                        // like the way Clipper.js does it
                        // normal 1
                        inflatedPath.push({X:n1Pt.x, Y:n1Pt.y, n1: true});
                        // orig pt
                        //inflatedPath.push(pt);
                        // normal 2
                        inflatedPath.push({X:n2Pt.x, Y:n2Pt.y, n2: true});
                        
                    }
                }
                
                // DEBUG. draw clipper path of inflatedPath
                var threeObj = this.drawClipperPaths([inflatedPath], 0x00ff00, 0.99, 3);
                this.threePathEndMillArr.push(threeObj);
            }
            
            
            console.log("killing logging. done running");
            console.log = function() {};
            return newPaths;
            
            // we have to build a three.js object of lines for absolutely every single
            // point in the entire structure of paths. this is a heavy object, but is 
            // needed for three.js's 
            var group = new THREE.Group();
            for (var i = 0; i < path.length; i++) {
                
                // generate a test path of individual three.js lines
                var groupOfLines = this.getThreeJsGroupOfLinesForPath(newPath);
                group.add(mainPath.groupOfLines);
                
                // also generate a normals array for each mainPath
                // create normals for each pt on mainPath
                // each pt gets 2 normals, one on left for incoming line and one
                // on right for outgoing line
                var normalsArr = [];
                for (var ptIndex = 0; ptIndex < mainPath.orig.length; ptIndex++) {
                    var pt = mainPath.orig[ptIndex];
                    var normals = this.getNormals(ptIndex, mainPath.orig);
                    
                    //console.log("normals:", normals);
                    //var ah1 = this.drawNormal(normals.n1, pt, size, 0xff0000, 0.9, 0);
                    //var ah2 = this.drawNormal(normals.n2, pt, size, 0x00ff00, 0.9, 0);
                    //console.log("ah1:", ah1);
                    
                    // figure out inflate point for normal 1
                    var iPt = {};
                    iPt.dir = new THREE.Vector3(normals.n1.X, normals.n1.Y, 0);
                    iPt.origin = new THREE.Vector3(pt.X, pt.Y, 0);
                    iPt.distance = size;
                    // figure out the final inflate position
                    iPt.arrowHelper = new THREE.ArrowHelper( iPt.dir, iPt.origin, iPt.distance, 0xffff00 );
                    //this.sceneAdd(iPt.arrowHelper);
                    iPt.arrowHelper.updateMatrixWorld();
                    var vector = iPt.arrowHelper.line.geometry.vertices[1].clone();
                    vector.applyMatrix4( iPt.arrowHelper.line.matrixWorld );
                    iPt.inflatePt = vector;
                    //console.log("about to create particle for final inflate pt:", iPt.inflatePt);
                    var particle = this.getParticle(iPt.inflatePt.x, iPt.inflatePt.y, iPt.inflatePt.z, 0x0000ff);
                    //this.sceneAdd(particle);
                    normals.n1.iPt = iPt;
                    
                    // figure out inflate point for normal 2
                    var iPt = {};
                    iPt.dir = new THREE.Vector3(normals.n2.X, normals.n2.Y, 0);
                    iPt.origin = new THREE.Vector3(pt.X, pt.Y, 0);
                    iPt.distance = size;
                    // figure out the final inflate position
                    iPt.arrowHelper = new THREE.ArrowHelper( iPt.dir, iPt.origin, iPt.distance, 0xffff00 );
                    //this.sceneAdd(iPt.arrowHelper);
                    iPt.arrowHelper.updateMatrixWorld();
                    var vector = iPt.arrowHelper.line.geometry.vertices[1].clone();
                    vector.applyMatrix4( iPt.arrowHelper.line.matrixWorld );
                    iPt.inflatePt = vector;
                    //console.log("about to create particle for final inflate pt:", iPt.inflatePt);
                    var particle = this.getParticle(iPt.inflatePt.x, iPt.inflatePt.y, iPt.inflatePt.z, 0x0000ff);
                    //this.sceneAdd(particle);
                    normals.n2.iPt = iPt;

                    normalsArr.push(normals);
                }
                mainPath.normals = normalsArr;

            }
        },

        // This section deals with enabling the mouseover on the 3D area
        // to show popups and hilite signals as you move your mouse around. I
        // have found this to be one of the nicest parts of the Eagle BRD Import
        // to visualize the Eagle BRD better than what Eagle lets us do
        
        raycaster: null,
        projector: null, // = new THREE.Projector();
        arrowHelper: null,
        intersectObjects: [], // contains three.js objects that we want to detect on mouse movement in the 3d viewer
        renderArea: null, // cache for renderarea dom element
        infoArea: null, // store dom that shows info
        infoSignalArea: null,
        lastIntersect: null, // last obj we showed info for
        hidePopupsElem: null, // quick access to hide checkbox
        setupMouseOver: function () {
            this.raycaster = new THREE.Raycaster();
            //this.projector = new THREE.Projector();
            $('#com-chilipeppr-widget-3dviewer-renderArea').mousemove(this.onMouseOver.bind(this));
            //$('#com-chilipeppr-widget-3dviewer-renderArea').click(this.onMouseOver.bind(this));
            this.renderArea = $('#com-chilipeppr-widget-3dviewer-renderArea');
            this.infoArea = $('.com-chilipeppr-widget-eagle-info');
            this.infoArea.prependTo(this.renderArea);
            this.infoSignalArea = $('.com-chilipeppr-widget-eagle-info-signal');
            this.infoSignalArea.prependTo(this.renderArea);
            this.hidePopupsElem = $('#com-chilipeppr-widget-eagle .popups-hide');
            var that = this;
            this.hidePopupsElem.change(function(evt) {
                if (that.hidePopupsElem.is(":checked")) {
                    // hide
                    that.deactivateMouseMove();
                } else {
                    // unhide
                    that.reactivateMouseMove();
                }
            });
            
        },
        reactivateMouseMove: function() {
            // add mouseover event
            console.log("reactivateMouseMove");
            $('#com-chilipeppr-widget-3dviewer-renderArea').mousemove(this.onMouseOver.bind(this));
        },
        deactivateMouseMove: function() {
            console.log("deactivateMouseMove");
            // remove mouseover event
            $('#com-chilipeppr-widget-3dviewer-renderArea').unbind("mousemove");
            this.hidePopups();
        },
        hidePopups: function() {
            
            console.log("hiding popups and resetting opacities");
            this.infoSignalArea.addClass('hidden');
            this.infoArea.addClass('hidden');
            
            // reset opacities
            if (this.lastIntersect != null) {
                console.log("lastIntersect:", this.lastIntersect);
                // also reset opacity for other items we hilited
                if (this.lastIntersectOtherMaterials != null) {
                    //console.log("lastIntersectOtherMaterials:", this.lastIntersectOtherMaterials);
                    this.lastIntersectOtherMaterials.forEach(function(material) {
                        material.opacity = material.opacityBackup;
                    });
                    this.lastIntersectOtherMaterials = [];
                }
                this.lastIntersect.object.material.opacity = this.lastIntersect.object.material.opacityBackup;
            }
        },
        lastIntersectOtherMaterials: [], // array to hold materials modified by mouseover so we can reset them later to normal opacity
        onMouseOver: function (event) {

            if(this.hidePopupsElem.is(":checked"))
                return;
            
            //console.log("onMouseOver. evt:", event);
            //return;
            //if (!event.ctrlKey) return;
            //event.preventDefault();

            //this.obj3dmeta.widget.scene.updateMatrixWorld();

            //this.obj3dmeta.widget.renderer.clear();


            // wake animation so we see the results
            this.obj3dmeta.widget.wakeAnimate();
            //camera.aspect = window.innerWidth / window.innerHeight;
            //this.obj3dmeta.camera.updateProjectionMatrix();
            //this.obj3dmeta.scene.updateMatrixWorld();

            var vector = new THREE.Vector3();
            //console.log("x/y coords:", event.clientX, event.clientY, window.innerWidth, window.innerHeight);

            //mouseVector.x = 2 * (e.clientX / containerWidth) - 1;
            //mouseVector.y = 1 - 2 * ( e.clientY / containerHeight );

            var containerWidth = this.renderArea.innerWidth();
            var containerHeight = this.renderArea.innerHeight();
            //var containerWidth = window.innerWidth;
            //var containerHeight = window.innerHeight;

            //console.log("conainer w/h", containerWidth, containerHeight);

            //this.obj3dmeta.widget.renderer.setSize( containerWidth, containerHeight );
            var x = event.clientX;
            var y = event.clientY;
            vector.set((event.clientX / containerWidth) * 2 - 1, -(event.clientY / containerHeight) * 2 + 1, 0.5);
            //console.log("this.renderArea", this.renderArea);
            //vector.set( ( event.clientX / this.renderArea.innerWidth ) * 2 - 1, - ( event.clientY / this.renderArea.innerHeight ) * 2 + 1, 0.5 );
            //console.log("vector after setting", vector);
            //vector.unproject( this.obj3dmeta.camera );
            // manual unproject
            var matrix = new THREE.Matrix4();
            //matrix.identity();
            //console.log("default matrix:", matrix);
            //console.log("camera projectionMatrix:", this.obj3dmeta.camera.projectionMatrix);
            var matrixInverse = matrix.getInverse(this.obj3dmeta.camera.projectionMatrix);
            //console.log("matrixInverse:", matrixInverse);
            matrix.multiplyMatrices(this.obj3dmeta.camera.matrixWorld, matrixInverse);
            //console.log("matrix after multiply:", matrix);
            vector.applyProjection(matrix);
            // Unproject the vector
            //this.projector.unprojectVector(vector, this.obj3dmeta.camera);
            //console.log("vector after unprojecting", vector);
            //console.log("vector:", vector);

            vector.sub(this.obj3dmeta.camera.position);
            //console.log("vector after subtracing camera pos:", vector);
            vector.normalize();
            //console.log("vector after normalize:", vector);
            //this.raycaster.set( this.obj3dmeta.camera.position, vector );
            this.raycaster.ray.set(this.obj3dmeta.camera.position, vector);
            //console.log("raycaster.ray:", this.raycaster.ray);
            //console.log("origin:", this.raycaster.ray.origin);
            //console.log("direction:", this.raycaster.ray.direction);

            // add an arrow to represent click
            /*
            var dir = this.raycaster.ray.direction.clone(); //new THREE.Vector3( 1, 0, 0 );
            var origin = this.raycaster.ray.origin.clone(); //new THREE.Vector3( 0, 0, 0 );
            var length = 10;
            var hex = 0x000000;
            
            this.sceneRemove( this.arrowHelper);
            this.arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
            this.sceneAdd( this.arrowHelper );
            */

            //var intersects = raycaster.intersectObjects( objects );
            //console.log("objects:", this.obj3dmeta.scene.children);
            //var intersects = this.raycaster.intersectObjects( this.obj3dmeta.scene.children, true );
            //console.log("testing intersect on:", this.intersectObjects);
            var intersects = this.raycaster.intersectObjects(this.intersectObjects, true);

            // reset last object
            if (this.lastIntersect != null) {
                // also reset opacity for other items we hilited
                if (this.lastIntersectOtherMaterials != null) {
                    this.lastIntersectOtherMaterials.forEach(function(material) {
                        material.opacity = material.opacityBackup;
                    });
                    this.lastIntersectOtherMaterials = [];
                }
                this.lastIntersect.object.material.opacity = this.lastIntersect.object.material.opacityBackup;
            }

            if (intersects.length > 0) {
                console.log("we got intersection on N objects:", intersects);
                //var that = this;
                //intersects.forEach(function(obj) {
                var obj = intersects[0];
                if (obj != this.lastIntersect) {
                    this.lastIntersect = obj;
                    //if ('elemKey' in obj.object.userData) {
                    console.log("intersect obj:", obj.object.userData);
                    //console.log("conainer w/h", containerWidth, containerHeight);
                    //console.log("onMouseOver. evt:", event);
                    //this.renderArea.prepend('<div style="position:absolute;top:' + y + 'px;left:' + x + 'px;" >' + obj.object.userData.elemKey + '</div>');
                    //console.log("found smd");
                    //obj.object.material.color.setHex( Math.random() * 0xffffff );
                    x += 30;
                    //y += 30;

                    
                    var ud = obj.object.userData;
                    if (!('type' in ud)) {
                        // we found this thru recursion, go to parent
                        // to get userData
                        ud = obj.object.parent.userData;
                    }
                    
                    // figure out signal name for this element that was moused over
                    var signalKey = "";
                    if (ud.type == "smd") {
                        signalKey = ud.elem.padSignals[ud.smd.name];
                    } else if (ud.type == "pad") {
                        signalKey = ud.elem.padSignals[ud.pad.name];
                    } else if (ud.type == "via") {
                        signalKey = ud.name; 
                    } else if (ud.type == "signal") {
                        signalKey = ud.name;
                    } else {
                        console.error("got ud.type that we did not recognize. ud:", ud);
                    }
                    console.log("signalKey:", signalKey);
                    
                    if(signalKey === undefined || signalKey == "undefined"){
                        if(ud.type == "pad") signalKey = ud.pad.name;
                        if(ud.type == "smd") signalKey = ud.smd.name;
                    }//UndefinedFix
                    
                    // update opacity for ALL smds/pads/vias/wires for this signal
                    // we use shared materials across all smds/pads/vias/wires
                    // so u only have to change the opacity once on each type
                    // now also find ALL other items in this signal
                    //var signalKey = ud.name;
                    var signal = this.clipperBySignalKey[signalKey];
                    console.log("signal:", signal);
                    
                    var opacity = 0.6;
                    if (!obj.object.material.opacityBackup) 
                        obj.object.material.opacityBackup = obj.object.material.opacity;
                    if (signal.smds && signal.smds.length > 0) {
                        signal.smds.forEach(function(smd) {
                            var material = smd.threeObj.material;
                            if (!material.opacityBackup) material.opacityBackup = material.opacity;
                            material.opacity = opacity;
                            this.lastIntersectOtherMaterials.push(material);
                        }, this);
                    }
                    if (signal.pads && signal.pads.length > 0) {
                        signal.pads.forEach(function(pad) {
                            var material = pad.threeObj.material;
                            if (!material.opacityBackup) material.opacityBackup = material.opacity;
                            material.opacity = opacity;
                            this.lastIntersectOtherMaterials.push(material);
                        }, this);
                    }
                    if (signal.vias && signal.vias.length > 0) {
                        var material = signal.vias[0].threeObj.material;
                        if (!material.opacityBackup) material.opacityBackup = material.opacity;
                        material.opacity = opacity;
                        this.lastIntersectOtherMaterials.push(material);
                    }
                    if (signal.wire && signal.wire.threeObj) {
                       
                        if (signal.wire.threeObj instanceof THREE.Mesh) {
                            var material = signal.wire.threeObj.material;
                            if (!material.opacityBackup) material.opacityBackup = material.opacity;
                            material.opacity = opacity;
                            this.lastIntersectOtherMaterials.push(material);
                        } else {
                            signal.wire.threeObj.children.forEach(function(wire) {
                                var material = wire.material;
                                if (!material.opacityBackup) material.opacityBackup = material.opacity;
                                material.opacity = opacity;
                                this.lastIntersectOtherMaterials.push(material);
                            }, this);
                        }
                    }


                    // now do specific stuff just for this item that was moused
                    // over, including making it's opacity darker than the rest of
                    // the signal items we already hilited
                    // see what type object
                    if (ud.type == "smd" || ud.type == "pad") {
                        
                        this.infoArea.find('.info-package').text(ud.pkg.name);
                        this.infoArea.find('.info-elem-name').text(ud.elem.name);
                        this.infoArea.find('.info-elem-value').text(ud.elem.value);
                        //this.infoArea.find('.row-pad').removeClass("hidden");

                        // Add checkbox if dispenser == on
                        if($('#com-chilipeppr-widget-eagle .dispenser-active').is(':checked')){
                           this.infoArea.find('.info-elem-dispenser').removeClass('hidden');
                           this.infoArea.find('.ignore-in-dispenser').change(function(e){
                              ud['ignoreInDispenser'] = (this.checked ? true : false);
                           });
                        }else{
                           this.infoArea.find('.info-elem-dispenser').addClass('hidden');
                        }
                        
                        
                        this.infoSignalArea.addClass('hidden');
                        this.infoArea.removeClass('hidden');
                        this.infoArea.css('left', x + "px").css('top', y + "px");
                        
                        if (ud.type == "smd") {
                            this.infoArea.find('.info-title').text("SMD Pad");
                            this.infoArea.find('.info-pad').text(ud.smd.name + " (of " + ud.pkg.smds.length + " smds)");
                            var sigName = ud.elem.padSignals[ud.smd.name];
                            if (sigName === undefined || sigName == null) sigName = "Not Connected";//UndefinedFix
                            this.infoArea.find('.info-signal').text(sigName);
                            this.infoArea.find('.info-layer').text(ud.smd.layer);
                        } else {
                            this.infoArea.find('.info-title').text("Pad");
                            this.infoArea.find('.info-pad').text(ud.pad.name + " (of " + ud.pkg.pads.length + " pads)");
                            var sigName = ud.elem.padSignals[ud.pad.name];
                            if (sigName === undefined || sigName == null) sigName = "Not Connected";//UndefinedFix
                            this.infoArea.find('.info-signal').text(sigName);
                            this.infoArea.find('.info-layer').text("Top Copper");
                        }

                    } else if (ud.type == "signal") {
                        console.log("mo on signal wire:", ud);
                        this.infoSignalArea.find('.info-title').text("Signal");                        
                        this.infoSignalArea.find('.info-signal').text(ud.name);
                        this.infoSignalArea.find('.info-layer').text(ud.layer.name);
                        this.infoSignalArea.find('.info-wirecnt').text(ud.layerWires.length);
                        this.infoSignalArea.find('.info-vias').text("-");
                        this.infoArea.addClass('hidden');
                        this.infoSignalArea.removeClass('hidden');
                        this.infoSignalArea.css('left', x + "px").css('top', y + "px");

                    } else if (ud.type == "via") {
                        console.log("via:", ud);
                        this.infoSignalArea.find('.info-title').text("Via"); 
                        this.infoSignalArea.find('.info-signal').text(ud.name);
                        this.infoSignalArea.find('.info-layer').text(ud.via.layers);
                        this.infoSignalArea.find('.info-wirecnt').text("-");
                        this.infoSignalArea.find('.info-vias').text(ud.layerVias.length);
                        this.infoArea.addClass('hidden');
                        this.infoSignalArea.removeClass('hidden');
                        this.infoSignalArea.css('left', x + "px").css('top', y + "px");
                    }

                    obj.object.material.opacity = 0.8;
                }
            } else {
                // hide info area

                this.infoArea.addClass('hidden');
                this.infoSignalArea.addClass('hidden');
            }

        },

        // THIS SECTION OF CODE IS UTILITY METHODS FOR WORKING WITH CLIPPER.JS
        
        getXorOfClipperPaths: function (subj_paths, clip_paths) {
            //console.log("getXorOfClipperPaths");
            var cpr = new ClipperLib.Clipper();
            var scale = 10000;
            ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
            ClipperLib.JS.ScaleUpPaths(clip_paths, scale);
            cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
            cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);
            var clipType = ClipperLib.ClipType.ctXor;
            var subject_fillType = ClipperLib.PolyFillType.pftNonZero;
            var clip_fillType = ClipperLib.PolyFillType.pftNonZero;
            var solution_paths = new ClipperLib.Paths();
            cpr.Execute(clipType, solution_paths, subject_fillType, clip_fillType);

            ClipperLib.JS.ScaleDownPaths(solution_paths, scale);
            ClipperLib.JS.ScaleDownPaths(clip_paths, scale);
            ClipperLib.JS.ScaleDownPaths(subj_paths, scale);
            return solution_paths;
        },
        getIntersectionOfClipperPaths: function (subj_paths, clip_paths) {
            //console.log("getIntersectionOfClipperPaths");
            var cpr = new ClipperLib.Clipper();
            var scale = 10000;
            ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
            ClipperLib.JS.ScaleUpPaths(clip_paths, scale);
            cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
            cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);
            var clipType = ClipperLib.ClipType.ctIntersection;
            var subject_fillType = ClipperLib.PolyFillType.pftNonZero;
            var clip_fillType = ClipperLib.PolyFillType.pftNonZero;
            var solution_paths = new ClipperLib.Paths();
            cpr.Execute(clipType, solution_paths, subject_fillType, clip_fillType);

            ClipperLib.JS.ScaleDownPaths(solution_paths, scale);
            ClipperLib.JS.ScaleDownPaths(clip_paths, scale);
            ClipperLib.JS.ScaleDownPaths(subj_paths, scale);
            return solution_paths;
        },
        getDiffOfClipperPaths: function (subj_paths, clip_paths) {
            //console.log("getDiffOfClipperPaths");
            var cpr = new ClipperLib.Clipper();
            var scale = 10000;
            ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
            ClipperLib.JS.ScaleUpPaths(clip_paths, scale);
            cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
            cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);
            var clipType = ClipperLib.ClipType.ctDifference;
            var subject_fillType = ClipperLib.PolyFillType.pftNonZero;
            var clip_fillType = ClipperLib.PolyFillType.pftNonZero;
            var solution_paths = new ClipperLib.Paths();
            cpr.Execute(clipType, solution_paths, subject_fillType, clip_fillType);

            ClipperLib.JS.ScaleDownPaths(solution_paths, scale);
            ClipperLib.JS.ScaleDownPaths(clip_paths, scale);
            ClipperLib.JS.ScaleDownPaths(subj_paths, scale);
            return solution_paths;
        },
        getAllPathsAsOuterOrientation: function(subj_paths) {
            var sol_path = [];
            subj_paths.forEach(function(path) {
                if (ClipperLib.Clipper.Orientation(path)) {
                    // we're fine. this is in outer mode
                    sol_path.push(path);
                } else {
                    // we should reverse it
                    sol_path.push(path.reverse());
                }
            });
            return sol_path;
        },
        getUnionOfClipperPaths: function (subj_paths) {
            //console.log("getUnionOfClipperPaths");
            var cpr = new ClipperLib.Clipper();
            var scale = 100000;
            ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
            cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
            var subject_fillType = ClipperLib.PolyFillType.pftNonZero;
            var clip_fillType = ClipperLib.PolyFillType.pftNonZero;
            var solution_paths = new ClipperLib.Paths();
            cpr.Execute(ClipperLib.ClipType.ctUnion, solution_paths, subject_fillType, clip_fillType);
            //console.log(JSON.stringify(solution_paths));
            //console.log("solution:", solution_paths);
            // scale back down
            for (var i = 0; i < solution_paths.length; i++) {
                for (var j = 0; j < solution_paths[i].length; j++) {
                    solution_paths[i][j].X = solution_paths[i][j].X / scale;
                    solution_paths[i][j].Y = solution_paths[i][j].Y / scale;
                }
            }
            ClipperLib.JS.ScaleDownPaths(subj_paths, scale);
            return solution_paths;
        },
        drawUnionOfClipperPaths: function (subj_paths) {
            var that = this;
            var solution_paths = this.getUnionOfClipperPaths(subj_paths);

            for (var i = 0; i < solution_paths.length; i++) {
                var lineUnionGeo = new THREE.Geometry();
                for (var j = 0; j < solution_paths[i].length; j++) {
                    lineUnionGeo.vertices.push(new THREE.Vector3(solution_paths[i][j].X, solution_paths[i][j].Y, 0));
                }
                // close it by connecting last point to 1st point
                lineUnionGeo.vertices.push(new THREE.Vector3(solution_paths[i][0].X, solution_paths[i][0].Y, 0));

                var lineUnionMat = new THREE.LineBasicMaterial({
                    color: 0x0000ff,
                    transparent: true,
                    opacity: 0.5
                });
                var lineUnion = new THREE.Line(lineUnionGeo, lineUnionMat);
                lineUnion.position.set(0, -20, 0);
                that.sceneAdd(lineUnion);
            }
        },
        getPadGeometryIntersectedWithPolygon: function(polygons, lineGeo, layerNumber){
            polygons.forEach(function (polygon) {
                if(layerNumber == polygon.layer){
                    var polygonGeo = new THREE.Geometry();
                    if('polyGeo' in polygon && polygon.polyGeo != null){
                        polygonGeo = polygon.polyGeo;
                    }
                    else{
                        for(var vidx = 0; vidx < polygon.vertices.length; vidx++){
                            var v0 = polygon.vertices[vidx];
                            var v1 = (polygon.vertices.length == vidx+1)?polygon.vertices[0]:polygon.vertices[vidx+1];
                            if("curve" in v0 && v0.curve != 0){
                                var cPoints = this.createCurvePoints(v0.x, v0.y, v1.x, v1.y, v0.curve);
                                cPoints.forEach(function(p){
                                    polygonGeo.vertices.push(new THREE.Vector3(p.x, p.y, 0));
                                });
                            }
                            else{
                                polygonGeo.vertices.push(new THREE.Vector3(v0.x, v0.y, 0));
                            }
                        }
                        polygon.polyGeo = polygonGeo;
                    }

                    lineGeo = this.unionLineGeometriesIfIntersected(lineGeo, polygonGeo);
                }
            }, this);
            return lineGeo;
        },
        unionLineGeometriesIfIntersected: function(lineGeo1, lineGeo2){
            console.log("AmeenG: lineGeo1", lineGeo1);
            console.log("AmeenG: lineGeo2", lineGeo2);
            var path1 = [];
            lineGeo1.vertices.forEach(function(vertex){
                path1.push({X: vertex.x, Y: vertex.y});
            });
            var path2 = [];
            lineGeo2.vertices.forEach(function(vertex){
                path2.push({X: vertex.x, Y: vertex.y});
            });
            var pathS = this.getIntersectionOfClipperPaths([path1], [path2]);
            console.log("AmeenG: pathS", pathS);
            if(pathS.length != 0){
                pathS = this.getUnionOfClipperPaths([path1, path2]);
                lineGeo = new THREE.Geometry();
                pathS[0].forEach(function(vertex){
                    lineGeo.vertices.push(new THREE.Vector3(vertex.X, vertex.Y, 0));
                });
                console.log("AmeenG: lineGeo", lineGeo);
                return lineGeo;
            }
            
            return lineGeo1;
        },
        drawClipperPaths: function (paths, color, opacity, z, zstep, isClosed, isAddDirHelper) {
            console.log("drawClipperPaths");
            var lineUnionMat = new THREE.LineBasicMaterial({
                color: color,
                transparent: true,
                opacity: opacity
            });

            if (z === undefined || z == null)
                z = 0;

            if (zstep === undefined || zstep == null)
                zstep = 0;

            if (isClosed === undefined || isClosed == null)
                isClosed = true;
            
            var group = new THREE.Object3D();

            for (var i = 0; i < paths.length; i++) {
                var lineUnionGeo = new THREE.Geometry();
                for (var j = 0; j < paths[i].length; j++) {
                    var actualZ = z;
                    if (zstep != 0) actualZ += zstep * j;
                    lineUnionGeo.vertices.push(new THREE.Vector3(paths[i][j].X, paths[i][j].Y, actualZ));
                    
                    // does user want arrow helper to show direction
                    if (isAddDirHelper) {
                        /*
                        var pt = { X: paths[i][j].X, Y: paths[i][j].Y, Z: actualZ };
                        var ptNext;
                        if (j + 1 >= paths[i].length)
                            ptNext = {X: paths[i][0].X, Y: paths[i][0].Y, Z: actualZ };
                        else
                            ptNext = {X: paths[i][j+1].X, Y: paths[i][j+1].Y, Z: actualZ };
                        // x2-x1,y2-y1
                        var dir = new THREE.Vector3( ptNext.X - pt.X, ptNext.Y - pt.Y, ptNext.Z - pt.Z );
                        var origin = new THREE.Vector3( pt.X, pt.Y, pt.Z );
                        var length = 0.1;
                        var hex = 0xff0000;
                        
                        var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
                        group.add( arrowHelper );
                        */
                    }
                }
                // close it by connecting last point to 1st point
                if (isClosed) lineUnionGeo.vertices.push(new THREE.Vector3(paths[i][0].X, paths[i][0].Y, z));

                var lineUnion = new THREE.Line(lineUnionGeo, lineUnionMat);
                //lineUnion.position.set(0,-20,0);
                group.add(lineUnion);
            }
            this.sceneAdd(group);
            return group;
        },
        createClipperPathsAsMesh_XXX: function (paths, color, opacity, holePath) {
            //console.log("createClipperPathsAsMesh. paths:", paths, "holePath:", holePath);
            if(color === undefined)
               color = this.colorDimension;
            var mat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: opacity,
                side: THREE.DoubleSide,
                depthWrite: false
            });

            
            if (paths.length == 1) {
                var shape = new THREE.Shape();
                var i = 0;
                for (var j = 0; j < paths[i].length; j++) {
                    var pt = paths[i][j];
                    if (j == 0) shape.moveTo(pt.X, pt.Y);
                    else shape.lineTo(pt.X, pt.Y);
                }
                
                // see if asked to create hole
                // multiple holes supported now
                if (holePath !== undefined && holePath != null) {
                    if (!(Array.isArray(holePath))) {
                        holePath = [holePath];
                    }
                    
                    for (var hi = 0; hi < holePath.length; hi++) {
                        var hp = holePath[hi];
                        console.log("adding hole:", hp);
                        var hole = new THREE.Path();
                        //var i = 0;
                        for (var j = 0; j < hp.length; j++) {
                            var pt = hp[j];
                            if (j == 0) hole.moveTo(pt.X, pt.Y);
                            else hole.lineTo(pt.X, pt.Y);
                        }
                        shape.holes.push(hole);
                    }
                }

                var geometry = new THREE.ShapeGeometry( shape );
                var shapeMesh = new THREE.Mesh(geometry, mat);
                
                //group.add(shapeMesh);
                return shapeMesh;
            } else {
                var group = new THREE.Object3D();
                
                for (var i = 0; i < paths.length; i++) {
                    var shape = new THREE.Shape();
                    for (var j = 0; j < paths[i].length; j++) {
                        var pt = paths[i][j];
                        if (j == 0) shape.moveTo(pt.X, pt.Y);
                        else shape.lineTo(pt.X, pt.Y);
                    }
                    
                    // see if asked to create hole
                    // multiple holes supported now
                    if (holePath !== undefined && holePath != null) {
                        if (!(Array.isArray(holePath))) {
                            holePath = [holePath];
                        }
                        
                        for (var hi = 0; hi < holePath.length; hi++) {
                            var hp = holePath[hi];
                            console.log("adding hole:", hp);
                            var hole = new THREE.Path();
                            //var i = 0;
                            for (var j = 0; j < hp.length; j++) {
                                var pt = hp[j];
                                if (j == 0) hole.moveTo(pt.X, pt.Y);
                                else hole.lineTo(pt.X, pt.Y);
                            }
                            shape.holes.push(hole);
                        }
                    }  
                    
                    var geometry = new THREE.ShapeGeometry( shape );
                    var shapeMesh = new THREE.Mesh(geometry, mat);
                    
                    group.add(shapeMesh);
                }
                return group;
            }
            //this.sceneAdd(group);
            
        },
        createClipperPathsAsMesh: function (paths, color, opacity, holePath, depth){
            if(color === undefined) color = this.colorDimension;
            //if(depth === undefined) depth = this.depthOfDimensions;
            var mat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: opacity,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            
            var group = new THREE.Object3D();
            for (var i = 0; i < paths.length; i++) {
                var shape = new THREE.Shape();
                for (var j = 0; j < paths[i].length; j++) {
                    var pt = paths[i][j];
                    if (j == 0) shape.moveTo(pt.X, pt.Y); else shape.lineTo(pt.X, pt.Y);
                }
               if (holePath !== undefined && holePath != null) {
                    if (!(Array.isArray(holePath))) {
                        holePath = [holePath];
                    }
                    
                    for (var hi = 0; hi < holePath.length; hi++) {
                        var hp = holePath[hi];
                        var hole = new THREE.Path();
                        for (var j = 0; j < hp.length; j++) {
                            var pt = hp[j];
                            if (j == 0) hole.moveTo(pt.X, pt.Y);
                            else hole.lineTo(pt.X, pt.Y);
                        }
                        shape.holes.push(hole);
                    }
                }
                var geometry;
                if(depth !== undefined){
                    var extrudeSettings = {
                    	steps: 1,
                    	amount: depth,
                    	bevelEnabled: false,
                    	bevelThickness: 0,
                    	bevelSize: 0,
                    	bevelSegments: 0
                    };
                    geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
                }
                else
                    geometry = new THREE.ShapeGeometry( shape );
                
                var shapeMesh = new THREE.Mesh(geometry, mat);
                group.add(shapeMesh);
            }
            return group;
        },
        /**
         * This method is used to show the milling/laser path of a line by creating a cyan
         * mesh of the width of the line. You pass in the line as a Clipper Path. That means
         * we treat the Clipper polygon as if it's the trace line.
         * opts = {
         *    width: 1, // width of line
         *    clipperPath: [[]], // typical array of array
         *    isSolid: true,  // if false then just shows outline
         *    color: 0x0000ff, // blue default
         *    opacity: 0.3, // 0 transparent to 1 non-transparent
         * }
         * Returns: THREE.Group of meshes
         */
        getMeshLineFromClipperPath: function(opts) {
        
            var width = opts.width ? opts.width : 1;
            var paths = opts.clipperPath;
            var isSolid = 'isSolid' in opts ? opts.isSolid : true;
            var color = opts.color ? opts.color : 0x0000ff;
            var opacity = opts.opacity ? opts.opacity : 0.3;
            var isShowOutline = 'isShowOutline' in opts ? opts.isShowOutline : true;
            
            var retGrp = new THREE.Group();
            console.log("getMeshLineFromClipperPath", opts);
            var localInflateBy = width / 2;
            // var trueInflateBy = width;
            
            // loop thru all paths and draw a mesh stroke
            // around the path with opacity set, such that when
            // multiples meshes are overlaid, their colors are darker
            // to visualize the toolpath. that means creating normals
            // for each pt and generating triangles to create mesh
            
            var group = new THREE.Object3D();
            var pathCtr = 0;
            
            var mat = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.99,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            var mat2 = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.99,
                depthWrite: false
            });
            //debugger;
            paths.forEach(function(path) {

                // create a clipper stroke path for each line segment
                // we won't create one for the last pt because there's no line
                // after it
                // var clipperStrokes = [];
                var csThisPath = [];
                //console.log("calculating stroke paths for each path");
                for (var pi = 0; pi < path.length; pi++) {
                    
                    var pt = path[pi];
                    var pt2 = (pi + 1 < path.length) ? path[pi + 1] : path[0];

                    if (pt2 != null) {
                        var clipperStroke = this.addStrokeCapsToLine(pt.X, pt.Y, pt2.X, pt2.Y, localInflateBy * 2);
                        if (clipperStroke.length > 1) console.warn("got more than 1 path on clipperStroke");
                        csThisPath.push(clipperStroke[0]);
                        //this.drawClipperPaths(clipperStroke, 0xff0000, 0.99, 0);
                    }
                    
                }
                var csUnion = this.getUnionOfClipperPaths(csThisPath);
                
                if (isShowOutline) {
                    var threeObj = this.drawClipperPaths(csUnion, 0x0000ff, opacity + 0.2, 0);
                    //this.sceneAdd(group);
                    retGrp.add(threeObj);
                }
                
                // This is SUPER SLOW cuz of the triangle calculation
                if (isSolid) {
                    //if (csUnion.length > 1) console.warn("got more than 1 path on union");
                    // investigate holes
                    var csUnionHoles = [];
                    var csUnionOuter = [];
                    var ctr = 0;
                    csUnion.forEach(function(path) {
                        if (ClipperLib.Clipper.Orientation(path)) {
                            // do nothing.
                            //console.log("outer path:", path);
                            csUnionOuter.push(path);
                        } else {
                            //console.warn("found a hole:", path);
                            csUnionHoles.push(path);
                        }
                        ctr++;
                    }, this);
                    if (csUnionOuter.length > 1) console.warn("got more than 1 outer path");
                    var mesh = this.createClipperPathsAsMesh(csUnionOuter, color, opacity, csUnionHoles);
                    // this.sceneAdd(mesh);
                    retGrp.add(mesh);
                }
                
                pathCtr++;
            }, this);
            return retGrp;
                
        },
        /**
         * Enormously useful function to inflate or deflate clipper paths. Pass
         * in the array of array like all normal clipper dimensions are. Then pass
         * in a pos/neg number for how much to inflate or deflate by. So to inflate by
         * 0.5mm then pass in 0.5. To deflate 0.8mm pass in -0.8. For joinType the
         * default is ClipperLib.JoinType.jtRound. See ClipperLib docs for joinType or
         * leave empty.
         */
        getInflatePath: function (paths, delta, joinType) {
            var scale = 10000;
            ClipperLib.JS.ScaleUpPaths(paths, scale);
            var miterLimit = 2;
            var arcTolerance = 10;
            joinType = joinType ? joinType : ClipperLib.JoinType.jtRound
            var co = new ClipperLib.ClipperOffset(miterLimit, arcTolerance);
            co.AddPaths(paths, joinType, ClipperLib.EndType.etClosedPolygon);
            //var delta = 0.0625; // 1/16 inch endmill
            var offsetted_paths = new ClipperLib.Paths();
            co.Execute(offsetted_paths, delta * scale);

            // scale back down
            for (var i = 0; i < offsetted_paths.length; i++) {
                for (var j = 0; j < offsetted_paths[i].length; j++) {
                    offsetted_paths[i][j].X = offsetted_paths[i][j].X / scale;
                    offsetted_paths[i][j].Y = offsetted_paths[i][j].Y / scale;
                }
            }
            ClipperLib.JS.ScaleDownPaths(paths, scale);
            return offsetted_paths;

        },
        getInflateOpenPath: function (paths, delta, joinType) {
            var scale = 10000;
            ClipperLib.JS.ScaleUpPaths(paths, scale);
            var miterLimit = 2;
            var arcTolerance = 10;
            joinType = joinType ? joinType : ClipperLib.JoinType.jtRound
            var co = new ClipperLib.ClipperOffset(miterLimit, arcTolerance);
            co.AddPaths(paths, joinType, ClipperLib.EndType.etRound);
            //var delta = 0.0625; // 1/16 inch endmill
            var offsetted_paths = new ClipperLib.Paths();
            co.Execute(offsetted_paths, delta * scale);

            // scale back down
            for (var i = 0; i < offsetted_paths.length; i++) {
                for (var j = 0; j < offsetted_paths[i].length; j++) {
                    offsetted_paths[i][j].X = offsetted_paths[i][j].X / scale;
                    offsetted_paths[i][j].Y = offsetted_paths[i][j].Y / scale;
                }
            }
            ClipperLib.JS.ScaleDownPaths(paths, scale);
            return offsetted_paths;

        },
        createThermalCutoutsFromSmd: function(smd, poly, myInflateBy) {
            
            console.log("creating thermal cutouts for an smd:", smd);
            var cutoutPath = ClipperLib.JS.Clone([smd.clipper]);
            //return cutoutPath;
            
            // start with inflated smd 
            var inflatedSmd = this.getInflatePath(cutoutPath, myInflateBy);
            
            // since we just want the endmill to go around the outside with a sliver
            // being cut off, deflate by 5% the inflateSmd path and then cutout from
            // inflateSmd
            var smdCutout = this.getInflatePath(inflatedSmd, myInflateBy * -0.05);
            
            // cutout from inflatedSmd
            inflatedSmd = this.getDiffOfClipperPaths(inflatedSmd, smdCutout);
            
            // now add back cross hairs, they should be width
            // of the poly outline stroke
            var width = poly.width;
            console.log("width of cross hairs:", width);
            
            // get center of smd
            console.log("smd:", smd);
            // get bounding box
            var threeInflateSmd = this.createClipperPathsAsMesh(inflatedSmd, 0x00ff00, 0.9);
            var bbox = new THREE.BoundingBoxHelper(threeInflateSmd);
            bbox.update();
            console.log("bbox:", bbox);
            var cx = ((bbox.box.max.x - bbox.box.min.x) / 2) + bbox.box.min.x;
            var cy = ((bbox.box.max.y - bbox.box.min.y) / 2) + bbox.box.min.y;
            var strokeX = this.addStrokeCapsToLine(bbox.box.min.x, cy, bbox.box.max.x, cy, width, "square" );
            var strokeY = this.addStrokeCapsToLine(cx, bbox.box.min.y, cx, bbox.box.max.y, width, "square" );
            //strokeX = this.getAllPathsAsOuterOrientation(strokeX);
            var clipperStroke = this.getUnionOfClipperPaths([strokeX[0], strokeY[0]]);
            //this.drawClipperPaths(clipperStroke, 0x00ff00, 0.99, debugZ);
            // inflate stroke
            clipperStroke = this.getInflatePath(clipperStroke, myInflateBy / 2);
            console.log("clipperStroke:", clipperStroke);
            
            // remove strokes from poly
            var pathWithStrokesRemoved = this.getDiffOfClipperPaths(inflatedSmd, clipperStroke);
            //this.drawClipperPaths(pathWithStrokesRemoved, 0x00ff00, 0.99, 5.0);
            
            // remove non-inflated smd 
            //pathWithStrokesRemoved.push(smd.clipper);
            var pathWithSmdRemoved = this.getDiffOfClipperPaths(pathWithStrokesRemoved, [smd.clipper]);
            //this.drawClipperPaths(pathWithSmdRemoved, 0x0000ff, 0.99, 6.0);
            
            return pathWithSmdRemoved;
        },
        sortObjByKey: function (obj){
          var keys = [];
          var sorted_obj = {};
      
          for(var key in obj){
              if(obj.hasOwnProperty(key)){
                  keys.push(key);
              }
          }
      
          // sort keys
          keys.sort();
      
          // create new array based on Sorted Keys
          jQuery.each(keys, function(i, key){
              sorted_obj[key] = obj[key];
          });
      
          return sorted_obj;
        },

        // THIS SECTION IS FOR WORKING ON THE DIMENSION OF THE BOARD
        adjustPath: function(path, rotation, positionX, positionY){
            if(rotation == 0){
                path.forEach(function(vertex){
                    vertex.X += positionX;
                    vertex.Y += positionY;
                });
            }
            else{
                path.forEach(function(vertex){
                    var angle = rotation + Math.atan2(vertex.Y, vertex.X);
                    var r = Math.sqrt(vertex.X * vertex.X + vertex.Y * vertex.Y);
                    vertex.X = positionX + r * Math.cos(angle);
                    vertex.Y = positionY + r * Math.sin(angle);
                });
            }
        },
        wiresConnected: function(w1, w2){
            return((w1.x2 == w2.x1) && (w1.y2 == w2.y1));
        },
        wiresConnectedF: function(w1, w2){
            if((w1.x2 == w2.x1) && (w1.y2 == w2.y1)) return true;
            if((w1.x2 == w2.x2) && (w1.y2 == w2.y2)){
                var x = w2.x1; w2.x1=w2.x2; w2.x2=x;
                var y = w2.y1; w2.y1=w2.y2; w2.y2=y;
                w2.curve = -w2.curve;
                return true;
            }
            return false;
        },
        wiresConnectedB: function(w1, w2){
            if((w1.x1 == w2.x2) && (w1.y1 == w2.y2)) return true;
            if((w1.x1 == w2.x1) && (w1.y1 == w2.y1)){
                var x = w2.x1; w2.x1=w2.x2; w2.x2=x;
                var y = w2.y1; w2.y1=w2.y2; w2.y2=y;
                w2.curve = -w2.curve;
                return true;
            }
            return false;
        },
        clipperDimension: [], // holds clipper formatted dimension
        buildDimensionClipper: function () {
            // var dimansionLayerNumber = this.useDimensionLayer? this.eagle.eagleLayersByName['Dimension'].number:-1;
            // var millingLayerNumber = this.useMillingLayer? this.eagle.eagleLayersByName['Milling'].number:-1;
            var dimansionLayerNumber = this.eagle.eagleLayersByName['Dimension'].number;
            var millingLayerNumber = this.eagle.eagleLayersByName['Milling'].number;
            // dimension is wires on layer 20 and/or layer 46
            var wires = [];
            var w = [];
            //V5.3 Updated, we need to look for package dimension wires in elements not directly in packages
            for (var elemKey in this.eagle.elements) {
                var elem = this.eagle.elements[elemKey];
                var pkg = this.eagle.packagesByName[elem.pkg];
                pkg.wires.forEach(function(wire){
                    if (wire.layer == dimansionLayerNumber || wire.layer == millingLayerNumber) {
                        var rot = 0;
                        if ('rot' in elem && elem.rot != null) {
                            rot = parseInt(elem.rot.replace(/R/i, "")) * Math.PI/180;
                        }
                        var wp = [{X:wire.x1, Y:wire.y1}, {X:wire.x2, Y:wire.y2}];
                        this.adjustPath(wp, rot, elem.x, elem.y);
                        wires.push({
                            "curve": wire.curve,
                            "layer": wire.layer,
                            "width": wire.width,
                            "x1": wp[0].X,
                            "x2": wp[1].X,
                            "y1": wp[0].Y,
                            "y2": wp[1].Y
                        });
                    }
                }, this);
            }
            for (var plainWireKey in this.eagle.plainWires) {
                if (this.eagle.plainWires[plainWireKey].length > 0) {
                    // yes, there's wires in this array
                    for (var i = 0; i < this.eagle.plainWires[plainWireKey].length; i++) {
                        var wire = this.eagle.plainWires[plainWireKey][i];
                        if (wire.layer == dimansionLayerNumber || wire.layer == millingLayerNumber) {
                            // we have a dimension
                            wires.push(wire);
                        }
                    }
                }
            }
            for (var plainCircleKey in this.eagle.plainCircles) {
                if (this.eagle.plainCircles[plainCircleKey].length > 0) {
                    // yes, there's circles in this array
                    for (var i = 0; i < this.eagle.plainCircles[plainCircleKey].length; i++) {
                        var circle = this.eagle.plainCircles[plainCircleKey][i];
                        if (circle.layer == dimansionLayerNumber || circle.layer == millingLayerNumber) {
                            // we have a dimension, push the circle as two half-circle wires
                        wires.push({
                            "curve": -180,
                            "layer": circle.layer,
                            "width": circle.width,
                            "x1": circle.x - circle.radius,
                            "x2": circle.x + circle.radius,
                            "y1": circle.y,
                            "y2": circle.y
                        });
                        wires.push({
                            "curve": -180,
                            "layer": circle.layer,
                            "width": circle.width,
                            "x1": circle.x + circle.radius,
                            "x2": circle.x - circle.radius,
                            "y1": circle.y,
                            "y2": circle.y
                        });
                        }
                    }
                }
            }
            
            //sort wires by layer and by width
            wires.sort(function(a, b){
                if (a.layer > b.layer) return 1;
                if (a.layer < b.layer) return -1;
                if (a.width > b.width) return 1;
                if (a.width < b.width) return -1;
                return 0;
            });
            var wiresInfo = [];
            var wiStartIndex = 0;
            for(var i = 0; i<wires.length-1; i++){
                var h = i + 1;
                var group = (wires[i].layer == wires[h].layer) && (wires[i].width == wires[h].width);
                
                if (!group || h == wires.length-1) {
                    var wiEndindex = group?h:i;
                    wiresInfo.push({
                        "start":wiStartIndex,
                        "end":wiEndindex});
                    wiStartIndex = i+1;
                }
                if(!group && h == wires.length-1){
                    wiresInfo.push({
                        "start":wiStartIndex,
                        "end":wiStartIndex});
                }
            }
            //console.log("WSA:WireInfo", wiresInfo);
            
            //console.log("WSA: Wires unsorted \\n", JSON.stringify(wires));
            for(var x = 0; x < wiresInfo.length; x++){
                var st = wiresInfo[x].start, en = wiresInfo[x].end;
                var found = true, i = st;
                for(;i<en && found; i++){//Check if wires are already sorted
                    found = this.wiresConnectedF(wires[i], wires[i+1]);
                }
                if (found) continue;//if wires are sorted skip sorting algorithem and check next wire segment
                var c = 0; i = st;
                //console.log("WSA: examining wires", st, "to", en);
                while(i < en && c <= (en-st)){//c is added to avoid endless loop, not necessary to keep but it won't harm
                    var ix = i+1, ip  = i-1;
                    var repeat = false;
                    found = ip<st?false:this.wiresConnectedB(wires[i], wires[ip]);
                    //console.log("WSA: comparing wires", i, "with previous wire, match=", found);
                    for(var h = i+1; !found && h <= en; h++){
                        found = this.wiresConnectedB(wires[i], wires[h]);
                        //console.log("WSA: comparing wire", i, "with", h, "match=", found);
                        if(found){
                            //console.log("WSA: moving", h, "behind", i);
                            //console.log("WSA: Shifting downd wires", i, "to", h-1);
                            var w = wires[h];
                            for(var n=h; n>i;n--) wires[n] = wires[n-1];
                            wires[i] = w;
                            var cp = this.wiresConnected(wires[h], wires[i]);
                            for(var n=i; n<h && cp;n++) {
                                cp = cp && this.wiresConnected(wires[n], wires[n+1]);
                                //console.log("WSA: looking for closed path", n, "to", n+1, found);
                            }
                            if(cp){
                                //console.log("WSA: closed path found", i, "to", h, found);
                                i=h+1;c=0;
                            }
                            repeat = true;
                            c++;
                        }
                    }
                    if(!repeat){//don't execute following code if current wire need to be compared again in above loop
                        found = this.wiresConnectedF(wires[i], wires[ix]);
                        //console.log("WSA: comparing wires", i, "with next wire, match=", found);
                        for(var h = ix+1; !found && h <= en; h++){
                            found = this.wiresConnectedF(wires[i], wires[h]);
                            //console.log("WSA: comparing wire", i, "with", h, "match=", found);
                            if(found){
                                //console.log("WSA: moving", h, "after", i);
                                //console.log("WSA: Shifting downd wires", ix, "to", h-1);
                                var w = wires[h];
                                for(var n=h; n>ix;n--) wires[n] = wires[n-1];
                                wires[ix] = w;
                            }
                        }
                        i++;c=0;
                    }
                }
            }
            //console.log("WSA: Wires sorted \\n", JSON.stringify(wires));

            //V5.3 Following code added to support multiple wire paths
            var dimensionInfo = [];
            var diStartIndex = 0;
            for(var i = 0; i<wires.length-1; i++){
                var h = i + 1;
                var connected = this.wiresConnected(wires[i], wires[h]);
                
                if (!connected || h == wires.length-1) {
                    var diEndindex = connected?h:i;
                    var diType = this.wiresConnected(wires[diEndindex], wires[diStartIndex]);
                    dimensionInfo.push({
                        "start":diStartIndex,
                        "end":diEndindex,
                        "width": wires[i].width,
                        "layer": wires[i].layer,
                        "type":diType?0:-1});
                    diStartIndex = i+1;
                }
                //if last wire is a path by it's own
                if(!connected && h == wires.length-1){
                    dimensionInfo.push({
                        "start":diStartIndex,
                        "end":diStartIndex, 
                        "width": wires[i].width,
                        "layer": wires[i].layer,
                        "type":-1});
                }
            }
            //console.log("WSA: dimensionInfo", dimensionInfo);
            // build clipper dimension format
            this.clipperDimension = [];
            this.clipperDimensionInfo = []; //V5.3D201701XX Added to support slots
            var cdiStartIndex = 0;
            var cdiEndIndex = 0;
            for(var n=0; n<dimensionInfo.length; n++){
                var di = dimensionInfo[n];
                var curves = [];
                for (var i = di.start; i <= di.end; i++) {
                    var wire = wires[i];
                    //console.log("clipper appending wire:", wire);
                    if(wire.curve == 0){//V5.2D20170105 if statement added to support curved dimensions
                        this.clipperDimension.push({X: wire.x1, Y: wire.y1});
                        cdiEndIndex++;
                    }
                    else {//V5.2D20170105 following code added to support curved dimensions, curvers will be rendered as lines not arcs
                        var curveStartIndex = cdiEndIndex;
                        var arc = this.drawArc(wire.x1, wire.y1, wire.x2, wire.y2, wire.curve, 0);
                        arc.updateMatrixWorld();
                        for(var j = 0; j < arc.geometry.vertices.length - 1; j++){
                            var v1 = arc.geometry.vertices[j].clone();
                            this.clipperDimension.push({X: v1.x, Y: v1.y});
                            cdiEndIndex++;
                        }
                        curves.push({"start":curveStartIndex, "end":cdiEndIndex-1, "curve":wire.curve});
                    }
                }
                //add second vertex of last wire to end of path
                this.clipperDimension.push({X: wire.x2, Y: wire.y2});
                //cdiEndIndex++;
                var paths = [this.clipperDimension.slice(cdiStartIndex, cdiEndIndex)];
                var bounds = ClipperLib.Clipper.GetBounds(paths);
                
                this.clipperDimensionInfo.push({
                    "start":cdiStartIndex,
                    "end":cdiEndIndex, 
                    "type":di.type,
                    "width": di.width,
                    "millDiameter": di.width,
                    "layer": di.layer,
                    "curves": curves,
                    "bounds": bounds
                });
                
                cdiStartIndex=++cdiEndIndex;
            }

            //Calculate board boundries to be used in mirroring feature
            var bounds = ClipperLib.Clipper.GetBounds([this.clipperDimension]);
            this.boardBoundaries = {
                MinimumX: bounds.left,
                MinimumY: bounds.top,
                MaximumX: bounds.right,
                MaximumY: bounds.bottom
            };

            //We now need to check which paths to deflate
            //var diaOfEndmill = $('.dimension-mill-diameter').val();
            for(i=0; i<this.clipperDimensionInfo.length; i++){
                for(j=0; j<this.clipperDimensionInfo.length; j++){
                    if (i==j) continue;//skip urself
                    var cdi1 = this.clipperDimensionInfo[i];
                    if(cdi1.type < 0) continue;//skip open path
                    var cdi2 = this.clipperDimensionInfo[j];
                    if (cdi1.layer != cdi2.layer) continue;
                    //if path cdi1 inside path cdi1, deflate cdi1, AMEEN TODO: compare actual paths not bounds
                    if( (cdi1.bounds.left   > cdi2.bounds.left  ) &&
                        (cdi1.bounds.bottom < cdi2.bounds.bottom) &&
                        (cdi1.bounds.right  < cdi2.bounds.right ) &&
                        (cdi1.bounds.top    > cdi2.bounds.top   )
                    ){
                        // if(((cdi1.bounds.right - cdi1.bounds.left) > diaOfEndmill) &&
                        //   ((cdi1.bounds.bottom - cdi1.bounds.top) > diaOfEndmill))
                            this.clipperDimensionInfo[i].type = 1;//deflate
                        // else
                        //     this.clipperDimensionInfo[i].type = -2;//ignore
                        
                    }
                }
            }
            //Not required, to be sorted in exportGcodeDimensions
            //this.clipperDimensionInfo.sort(function(a, b){return b.type - a.type});
            
            //console.log("WSA", "C Dimension wire: ", this.clipperDimension);
            //console.log("WSA", "C Dimension Info: ", this.clipperDimensionInfo);
            //No need to return wires any more, clipperDimension and clipperDimensionInfo will be used instead
            //return wires;
        },
        
        //draw3dDimension: function (endmillSize) {
        draw3dDimension: function () {
            var that = this;
            
            console.log("draw3dDimension", this.eagle);

            //Set millDiameter based on user selections
            that.millDiameterMin = that.millDiameter;
            for(var n=0; n<that.clipperDimensionInfo.length; n++){
                var cdi = that.clipperDimensionInfo[n];
                if(cdi.width < that.minWireWidthToMill){
                    if(that.ignoreSmallWires)
                        cdi.millDiameter = 0;
                    else
                        cdi.millDiameter = that.millDiameter;
                }
                else {
                    if(that.cuttingToolOption == 1)//use one tool
                        cdi.millDiameter = that.millDiameter;
                    else
                        cdi.millDiameter = cdi.width;
                }
                that.millDiameterMin = Math.min(that.millDiameterMin, cdi.millDiameter)
            }
            //sort milling paths by tool size then by path type (1:Deflated, 0:Inflated, -1:open, -2:ignored)
            this.clipperDimensionInfo.sort(function(a, b){
                var ta = a.type, tb = b.type;
                ta = ta<0?9:ta; tb = tb<0?9:tb;
                if(a.millDiameter > b.millDiameter) return 1;
                if(a.millDiameter < b.millDiameter) return -1;
                // if(b.type > a.type) return 1;
                // if(b.type < a.type) return -1;
                if(tb > ta) return 1;
                if(tb < ta) return -1;
                return 0;
                
            });
            for(var n=0; n<that.clipperDimensionInfo.length; n++){
                var cdi = that.clipperDimensionInfo[n];
                var color = cdi.layer == 20? this.colorDimension: this.colorMilling;
                var lineMat = new THREE.LineBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: .8
                });
                var lineGeo = new THREE.Geometry();
                for (var i = cdi.start; i <= cdi.end; i++) {
                    var cd = that.clipperDimension[i];
                    lineGeo.vertices.push(new THREE.Vector3(cd.X, cd.Y, 0));
                }
                var line = new THREE.Line(lineGeo, lineMat);
                this.sceneAdd(line);

                if(cdi.millDiameter != 0){
                    var color = cdi.layer == 20? that.colorDimension: that.colorMilling;
                    var path = this.clipperDimension.slice(cdi.start, cdi.end+1);
                    var paths = new ClipperLib.Paths();
                    var sol_pathsOuter = [];
                    var sol_pathsHoles = [];
                    if((cdi.width < that.minWireWidthToMill) && (cdi.type != -1)){//Closed path with wire width = zero
                        paths = that.getInflatePath([path], cdi.type == 0? cdi.millDiameter/2:-cdi.millDiameter/2);
                        if(paths.length > 0){
                            path = [];
                            paths[0].forEach(function(v){
                                path.push({X:v.X,Y:v.Y});
                            });
                            path.push({X:paths[0][0].X,Y:paths[0][0].Y});
                        }
                        else{
                            cdi.type = -2;
                            color = this.colorFailed;
                            sol_pathsOuter.push(path);
                        }

                    }
                    if(cdi.type != -2){
                        paths = that.getInflateOpenPath([path], cdi.millDiameter/2);
                        paths.forEach(function(path) {
                            if (ClipperLib.Clipper.Orientation(path)) {
                                sol_pathsOuter.push(path);
                            } else {
                                sol_pathsHoles.push(path);
                            }
                        }, this);
                    }
                    var mesh = this.createClipperPathsAsMesh(sol_pathsOuter, color, that.opacityDimension, sol_pathsHoles);
                    this.sceneAdd(mesh);
                }
            }
        },
        draw3dTabs: function (){
            if(!this.tabs.useTabs) return;
            var dimensions = this.dimensionsToMill;
            for(var i = 0; i<dimensions.length; i++){
                var diaOfEndmill = dimensions[i].millDiameter;
                var tabMesh = this.getTabMesh(this.tabs.width, diaOfEndmill);
                if(dimensions[i].isOpen) continue;
                var v1 = {X: dimensions[i].X, Y: dimensions[i].Y};
                for(var j=0; j<dimensions[i].lines.length; j++){
                    var line = dimensions[i].lines[j];
                    var v2 = {X: line.X, Y: line.Y};
                    if(line.isCurve){
                        var angle = line.C.curve * Math.PI / 180;
                        var alpha = this.tabs.distance / line.C.radius;
                        var count = Math.round(Math.abs(angle/alpha) - 0.5);
                        if (!(count>0)) {v1 = v2; continue;}
                        var sign = line.C.clockWise?-1:1;
                        var offset = line.C.startAngle + sign*(Math.abs(angle) - alpha * (count-1))/2;
                        for(var n=0; n<count; n++){
                            var a =  offset + sign * n * alpha;
                            var x = line.C.X + line.C.radius * Math.cos(a);
                            var y = line.C.Y + line.C.radius * Math.sin(a);
                            var mesh = tabMesh.clone();
                            mesh.rotation.z = a + Math.PI/2;
                            mesh.position.set(x, y, 0.05);
                            this.sceneAdd( mesh );
                        }
                    }
                    else{
                        var length = Math.sqrt((v2.X-v1.X)*(v2.X-v1.X) + (v2.Y-v1.Y)*(v2.Y-v1.Y));
                        var count = Math.round(length/this.tabs.distance - 0.5);
                        if (!(count>0)) {v1 = v2; continue;}
                        var angle = Math.atan2(v2.Y-v1.Y, v2.X-v1.X);
                        var offset = (length - this.tabs.distance * (count-1))/2;
                        for(var n=0; n<count; n++){
                            var d = offset + n * this.tabs.distance;
                            var x = v1.X + d * Math.cos(angle);
                            var y = v1.Y + d * Math.sin(angle);
                            var mesh = tabMesh.clone();
                            mesh.rotation.z = angle;
                            mesh.position.set(x, y, 0.05);
                            this.sceneAdd( mesh );
                        }
                    }
                    v1 = v2;
                }
                v1 = {X: dimensions[i].X, Y: dimensions[i].Y};
            }
        },
        getTabMesh: function(width, d){
            //var arc, points, path, arcGeo;
            var shape = new THREE.Shape();
            
            shape.moveTo(-width/2, -d/2);
            shape.lineTo( width/2, -d/2);
            shape.lineTo( width/2,  d/2);
            shape.lineTo(-width/2,  d/2);
            shape.lineTo(-width/2, -d/2);
            
            //shape.moveTo(-width/2-d/2, -d/2);
            // arc = new THREE.ArcCurve( width/2+d/2, 0, d/2, 3*Math.PI/2, Math.PI/2, true );
            // path = new THREE.Path();
            // points = arc.getSpacedPoints( 15 );
            // arcGeo = path.createGeometry( points );
            // for(var i=0; i<arcGeo.vertices.length; i++)
            //     shape.lineTo(arcGeo.vertices[i].x, arcGeo.vertices[i].y);
            
            // arc = new THREE.ArcCurve(-width/2-d/2, 0, d/2, Math.PI/2, 3*Math.PI/2, true );
            // path = new THREE.Path();
            // points = arc.getSpacedPoints( 15 );
            // arcGeo = path.createGeometry( points );
            // for(var i=0; i<arcGeo.vertices.length; i++)
            //     shape.lineTo(arcGeo.vertices[i].x, arcGeo.vertices[i].y);
                
            var geometry, material;
            if(false){
                var extrudeSettings = {
                	steps: 1,
                	amount: this.tabs.height,
                	bevelEnabled: false,
                	bevelThickness: 0,
                	bevelSize: 0,
                	bevelSegments: 0
                };
                geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
                material = new THREE.MeshBasicMaterial( { color: this.colorTabs, transparent: true, opacity: this.opacityTabs } );
            }
            else{
                geometry = new THREE.ShapeGeometry( shape );
                material = new THREE.LineBasicMaterial( { color: this.colorTabs, transparent: true, opacity: this.opacityTabs } );
            }
            
            var mesh = new THREE.Mesh( geometry, material );
            return mesh;
        },

        // UTILITY METHOD TO GENERATE A THREE.JS STROKE FOR A LINE
        // i.e. this takes a line with start/end and creates a stroked line with
        // a round end and returns a three.js object
        
        addStrokeCapsToLine: function (x1, y1, x2, y2, width, capType) {

            var cap = capType != null ? capType : "round";

            // we are given a line with two points. to stroke and cap it
            // we will draw the line in THREE.js and then shift x1/y1 to 0,0
            // for the whole line
            // then we'll rotate it to 3 o'clock
            // then we'll shift it up on x to half width
            // we'll create new vertexes on -x for half width
            // we then have a drawn rectangle that's the stroke
            // we'll add a circle at the start and end point for the cap
            // then we'll unrotate it
            // then we'll unshift it
            var group = new THREE.Object3D();

            var lineGeo = new THREE.Geometry();
            lineGeo.vertices.push(new THREE.Vector3(x1, y1, 0));
            lineGeo.vertices.push(new THREE.Vector3(x2, y2, 0));
            var lineMat = new THREE.LineBasicMaterial({
                color: this.colorSignal,
                transparent: true,
                opacity: this.opacitySignal
            });
            var line = new THREE.Line(lineGeo, lineMat);

            // shift to make x1/y1 zero
            line.position.set(x1 * -1, y1 * -1, 0);
            //line.updateMatrixWorld();
            group.add(line);

            // figure out angle to rotate to 0 degrees
            var x = x2 - x1;
            var y = y2 - y1;
            var theta = Math.atan2(-y, x);
            group.rotateZ(theta);

            // get our new xy coords for start/end of line
            //line.updateMatrixWorld();
            group.updateMatrixWorld();
            var v1 = line.localToWorld(line.geometry.vertices[0].clone());
            var v2 = line.localToWorld(line.geometry.vertices[1].clone());
            //console.log("v1,v2", v1, v2);

            // draw rectangle along line. apply width to y axis.
            var wireGrp = new THREE.Object3D();

            var rectGeo = new THREE.Geometry();
            rectGeo.vertices.push(new THREE.Vector3(v1.x, v1.y - width / 2, 0));
            rectGeo.vertices.push(new THREE.Vector3(v2.x, v1.y - width / 2, 0));
            rectGeo.vertices.push(new THREE.Vector3(v2.x, v1.y + width / 2, 0));
            rectGeo.vertices.push(new THREE.Vector3(v1.x, v1.y + width / 2, 0));
            rectGeo.vertices.push(new THREE.Vector3(v1.x, v1.y - width / 2, 0));
            var rectLines = new THREE.Line(rectGeo, lineMat);
            wireGrp.add(rectLines);
            //rectLines.position.set(x1 * -1, y1 * -1, 0);
            //group.add(rectLines);

            // now add circle caps
            if (cap == "round") {
                var radius = width / 2;
                var segments = 16;
                var circleGeo = new THREE.CircleGeometry(radius, segments);
                // Remove center vertex
                circleGeo.vertices.shift();
                var circle = new THREE.Line(circleGeo, lineMat);
                // clone the circle
                var circle2 = circle.clone();

                // shift left (rotate 0 is left/right)
                var shiftX = 0; //radius * -1;
                var shiftY = 0;
                circle.position.set(shiftX + v1.x, shiftY + v1.y, 0);
                wireGrp.add(circle);

                // shift right
                var shiftX = 0; //radius * 1;
                var shiftY = 0;
                circle2.position.set(shiftX + v2.x, shiftY + v2.y, 0);
                wireGrp.add(circle2);
            }

            // now reverse rotate
            wireGrp.rotateZ(-theta);

            // unshift postion
            wireGrp.position.set(x1 * 1, y1 * 1, 0);

            //this.sceneAdd(wireGrp);

            // now simplify via Clipper
            var subj_paths = [];
            wireGrp.updateMatrixWorld();
            var lineCtr = 0;
            wireGrp.children.forEach(function (line) {
                //console.log("line in group:", line);
                subj_paths.push([]);
                line.geometry.vertices.forEach(function (v) {
                    //line.updateMatrixWorld();
                    //console.log("pushing v onto clipper:", v);
                    var vector = v.clone();
                    var vec = line.localToWorld(vector);
                    subj_paths[lineCtr].push({
                        X: vec.x,
                        Y: vec.y
                    });
                }, this);
                lineCtr++;
            }, this);

            var sol_paths = this.getUnionOfClipperPaths(subj_paths);
            //this.drawClipperPaths(sol_paths, this.colorSignal, 0.8);
            //this.sceneAdd(group);
            return sol_paths;

        },

        // THIS SECTION TURNS THE BRD FILE INTO A USABLE JAVASCRIPT OBJECT
        // THAT IS STRUCTED BY THE SIGNAL NAME AND EACH SIGNAL CONTAINS ALL
        // ELEMENTS FOR THAT SIGNAL
        
        // It also draws the basic Three.js objects for smds,pads,vias,wires.
        
        // the mondo object contains the whole structure of the board
        // with objects for each key item. the main index is the signal name, i.e.
        // GND, +5V, etc.
        clipperBySignalKey: [],
        clipperBySignalKeyItem: {
            wires: [],
            polys: [],
            vias: [],
            smds: [],
            pads: [],
        },
        clipperSignalWires: [], // holds clipper formatted paths
        clipperSignalPolys: [], // holds clipper formatted polygons
        draw3dHoles: function(){//V5.2D20170105 Added
            var that = this;
            console.group("draw3dHoles");
            //Add Plain holes
            var bigSceneGroup = new THREE.Group();
            this.eagle.plainHoles.forEach(function(hole){
                var colorHole = that.colorHole;
                var hx = that.flipX(hole.x);
                var hy = that.flipY(hole.y);
                if(!that.addHole(hole.drill, hx, hy)) colorHole = that.colorHoleUnhandled; //If hole cannot be drilled or milled change color to red
                var line = that.drawCircle(hx, hy, hole.drill/2, colorHole);
                line.rotateZ(Math.PI / 8);
                
                bigSceneGroup.add (line);
            });
            
            //Add Package holes
            for (var elemKey in this.eagle.elements) {
                var elem = this.eagle.elements[elemKey];
                
                var pkg = this.eagle.packagesByName[elem.pkg];
                
                pkg.holes.forEach(function(hole){
                    var colorHole = that.colorHole;
                    var hx = hole.x, hy = hole.y;
                    var cx = elem.x, cy = elem.y;
                    if ('rot' in elem && elem.rot != null) {
                        var rot = parseInt(elem.rot.replace(/\D+/i,''));
                        if (rot > 0) {
                            var r = (Math.PI / 180) * rot;
                            var sin = Math.sin(r);
                            var cos = Math.cos(r);
                            var nx = (cos * (hx)) - (sin * (hy));
                            var ny = (sin * (hx)) + (cos * (hy));
                            hx = nx; hy = ny;
                        }
                    }
                    if(elem.mirror) hx = - hx;
                    hx = that.flipX(cx + hx);
                    hy = that.flipY(cy + hy);
                    if(!that.addHole(hole.drill, hx, hy)) colorHole = that.colorHoleUnhandled; //If hole cannot be drilled or milled change color to red
                    var line = that.drawCircle(hx, hy, hole.drill/2, colorHole);
                    line.rotateZ(Math.PI / 8);
    
                    bigSceneGroup.add (line);
                });
            }
            that.sceneAdd(bigSceneGroup);
            if(this.holesUnhandledCount==0)//V5.2D20170105 Added
                $('.eagle-holes-alert').addClass("hidden");
            else
                $('.eagle-holes-alert').removeClass("hidden");
            console.groupEnd();
        },
        draw3dVias: function (layersName) {
            if (!layersName) return;
            var that = this;
            console.group("draw3dVias");
            //console.log("this.signalItems:", this.eagle.signalItems);
            
            var bigSceneGroup = new THREE.Group();
            
            for (var signalKey in this.eagle.signalItems) {
                
                var signalLayers = this.eagle.signalItems[signalKey];
                var layerItems = signalLayers[layersName];
                if (!layerItems) {
                    continue;
                }
                var layerVias = layerItems['vias'] || [];
                //console.log("layerVias:", layerVias);
                
                // create mondo storage
                if (this.clipperBySignalKey[signalKey] === undefined)
                    this.clipperBySignalKey[signalKey] = {};
                this.clipperBySignalKey[signalKey].vias = [];
                
                // create mesh version
                var viaMat = new THREE.MeshBasicMaterial({
                    color: this.colorVia,
                    transparent: true,
                    opacity: this.opacityVia,
                    side: THREE.DoubleSide,
                    depthWrite: false
                });
                var lineMat = new THREE.LineBasicMaterial({
                    color: this.colorVia,
                    transparent: true,
                    opacity: 0.99
                });

                layerVias.forEach(function (via) {
                    //console.log("generating circle for via:", via);

                    // save all drills for vias                  
                    // Most exists only drills with diameter 1.0 0.9 0.8 ...
                    var drill = via.drill.toFixed(1);
                    //V5.2D20170105 Commented 
                    // if(that.drillVias[drill] === undefined)
                    //     that.drillVias[drill] = [];
                    // that.drillVias[drill].push({
                    //     X: via.x.toFixed(4),
                    //     Y: via.y.toFixed(4),
                    //     D: via.drill.toFixed(4)
                    // });
                    var colorHole = this.colorHole; //V5.2D20170105 Aded
                    if(!this.addHole(via.drill, this.flipX(via.x), this.flipY(via.y))) colorHole = this.colorHoleUnhandled; //V5.2D20170105 Added if hole cannot be drilled or milled change color to red

                    //1:Draw outter via shape
                    var viashape = "round";
                    if ('shape' in via) viashape = via.shape;
                    
                    var diameter = (this.activeLayer == "Top" || this.activeLayer == "Bottom")?
                        via.diameterOuter: via.diameterInner;
                    var radius = diameter/2;//V5.1D20161227
                    var segments = 32;
                    if (viashape == "octagon") segments = 8;
                    
                    //maybe add var in front of viaGeo    
                    var viaGeo;
                    if (viashape == "square") {
                        viaGeo = new THREE.Geometry();
                        viaGeo.vertices.push(new THREE.Vector3(-radius,  -radius, 0.0));
                        viaGeo.vertices.push(new THREE.Vector3(-radius,  radius, 0.0)); 
                        viaGeo.vertices.push(new THREE.Vector3(radius,  radius, 0.0)); 
                        viaGeo.vertices.push(new THREE.Vector3(radius,  -radius, 0.0)); 
                        viaGeo.rotateZ(3*Math.PI / 8);
                    }
                    else {
                        viaGeo = new THREE.CircleGeometry(radius, segments);
                        // Remove center vertex
                        viaGeo.vertices.shift();
                    }
                    //2:Draw circle around the drill hole
                    var line = that.drawCircle(that.flipX(via.x), that.flipY(via.y), via.drill/2, colorHole);//V5.1D20161229 - flipX/flipY added //V5.2D20170105changed this.colorHole to colorHole
                    line.rotateZ(Math.PI / 8);
                    
                    bigSceneGroup.add (line);
                    
                    
                    // Create shape with hole
                    var shape = new THREE.Shape();
                    
                    // Add outside circle to via
                    var ptCtr = 0;
                    
                    viaGeo.vertices.forEach(function (pt) {
                        //console.log("pt on via:", pt);
                        if (ptCtr == 0) shape.moveTo(pt.x, pt.y);
                        else shape.lineTo(pt.x, pt.y);
                        ptCtr++;
                    }, this);

                    // create mesh for the via
                    var geometry = new THREE.ShapeGeometry( shape );
                    var mesh = new THREE.Mesh(geometry, viaMat );

                    // move shape to correct position
                    mesh.position.set(that.flipX(via.x), that.flipY(via.y), 0); //V5.1D20161229 - flipX/flipY added
                    mesh.rotateZ(Math.PI / 8);
                    
                    mesh.userData["type"] = "via";
                    mesh.userData["via"] = via;
                    mesh.userData["name"] = signalKey;
                    mesh.userData["layerVias"] = layerVias;
                    
                    bigSceneGroup.add (mesh);
                    // this.sceneAdd(mesh);
                    
                    // add that these get detected during
                    // mouseover
                    this.intersectObjects.push(mesh);

                    // add to via object
                    via["threeObj"] = mesh;
                    
                    var lineV;
                    if(viashape=="square"){
                        lineV = that.drawSquare2(via.x, via.y, diameter/2, that.colorHole);
                    } 
                    else {
                        lineV = that.drawCircle(via.x, via.y, diameter/2, that.colorHole, viashape=="octagon"?8:0);//V5.1D20161227
                        lineV.rotateZ(Math.PI / 8);//V5.1D20161227
                    }
                    // add clipper path
                    var clipperPath = [];
                    lineV.updateMatrixWorld();                      //V5.1D20161227 - line changed to LineV
                    lineV.geometry.vertices.forEach(function(v) {   //V5.1D20161227 - line changed to LineV
                        var vector = v.clone();
                        var vec = lineV.localToWorld(vector);       //V5.1D20161227 - line changed to LineV
                        clipperPath.push({X: that.flipX(vec.x), Y: that.flipY(vec.y)}); //V5.1D20161229 - flipX/flipY added
                    }, this);
                    this.clipperVias.push(clipperPath);
                    
                    // add to mondo object
                    this.clipperBySignalKey[signalKey].vias.push({
                        clipper: clipperPath,
                        via: via,
                        threeObj: mesh
                    });
                    
                }, this)
                
            }
            
            //V5.1D20161229 - commented (incomplete experimental mirror code)
            /*
            var rFlip = (Math.PI / 180) * 180;
            var axisFlip = new THREE.Vector3(0, 1, 0);
            if (this.activeLayer == 'Bottom' && this.flipTheBoard == true) { //If bottom layer flip board
                console.log("ray: Bottom Flip Vias (loc2)");
                that.rotateAroundObjectAxis(bigSceneGroup, axisFlip, rFlip);
                //placeholder for translating object by x or y board length
            } //vias get flipped
            */
            that.sceneAdd(bigSceneGroup);
            
            console.log("this.clipperBySignalKey[]:", this.clipperBySignalKey);
            console.groupEnd();
        
        },
        draw3dSignalWires: function (layer) {
            //debugger;
            if (!layer) {
                return;
            }
            
            

            console.group("draw3dSignalWires");
            console.log("layer:", layer);
            
            var layerNumber = layer.number;
            var layerName = layer.name;
              
            var that = this;

            var lineCap = 'round';
            // user may override the round cap, so take into account

            // contains all paths for each individual signal
            // so we can join them at the end
            var signalArr = [];
            
            var bigSceneGroup = new THREE.Group();

            for (var signalKey in this.eagle.signalItems) {

                var signalLayers = this.eagle.signalItems[signalKey],
                    layerItems = signalLayers[layer.number];
                if (!layerItems) {
                    continue;
                }
                //console.log("layerItems:", layerItems);
                var layerWires = layerItems['wires'] || [];
                
                console.log("layerWires:", layerWires);
                
                // create mondo storage
                if (this.clipperBySignalKey[signalKey] === undefined)
                    this.clipperBySignalKey[signalKey] = {};
                this.clipperBySignalKey[signalKey].layer = layer;
                this.clipperBySignalKey[signalKey].wire = {};
                
                //var that = this;

                // per signal wire centipede
                var centipede = [];

                var scale = 10000;
                //var that = this;

                layerWires.forEach(function (wire) {
                    //console.log("drawing wires. wire:", wire);
                    if(wire.curve == 0){//V5.3D201701XX if statement added to support curved signal wire
                        // use new util function
                        var sol_paths = that.addStrokeCapsToLine(
                            that.flipX(wire.x1), that.flipY(wire.y1), //V5.1D20161229 - flipX/flipY added
                            that.flipX(wire.x2), that.flipY(wire.y2), //V5.1D20161229 - flipX/flipY added
                            wire.width);
                        //that.drawClipperPaths(sol_paths, that.colorSignal, 0.2);
    
                        //console.log("about to add sol_paths to centipede:", sol_paths);
                        centipede.push(sol_paths[0]);
                        wire.clipper = sol_paths[0];
                    }
                    else {//V5.3D201701XX Following code added to support curved wires
                        var arc = that.drawArc(wire.x1, wire.y1, wire.x2, wire.y2, wire.curve, 0);
                        arc.updateMatrixWorld();
                        for(var j = 0; j < arc.geometry.vertices.length - 1; j++){
                            var v1 = arc.geometry.vertices[j].clone();
                            var ver1 = arc.localToWorld(v1);
                            var v2 = arc.geometry.vertices[j+1].clone();
                            var ver2 = arc.localToWorld(v2);
                            var sol_paths = that.addStrokeCapsToLine(
                                that.flipX(ver1.x), that.flipY(ver1.y),
                                that.flipX(ver2.x), that.flipY(ver2.y),
                                wire.width);
                            centipede.push(sol_paths[0]);
                            wire.clipper = sol_paths[0];
                        } 
                    }
                });

                // merge centipede array of signals into single object
                // do a union with Clipper.js
                var sol_paths = this.getUnionOfClipperPaths(centipede);
                //this.drawClipperPaths(sol_paths, this.colorSignal, 0.2);
                // we can get holes in sol_paths. it's rare but if a user created
                // their board in such a way that they created a circle with their
                // wires, we get a hole here. that means we need to separate those
                // out before asking Three.js to draw the shape because it's not smart
                // enough to look at winding order of the paths like Clipper.js is
                var sol_pathsOuter = [];
                var sol_pathsHoles = [];
                sol_paths.forEach(function(path) {
                    if (ClipperLib.Clipper.Orientation(path)) {
                        sol_pathsOuter.push(path);
                    } else {
                        sol_pathsHoles.push(path);
                    }
                }, this);
                // debug draw
                if (sol_pathsHoles.length > 0) {
                    console.log("Found signal wire path with holes:", sol_pathsHoles, "paths:", sol_pathsOuter, "signalKey:", signalKey);
                    //this.drawClipperPaths(sol_pathsOuter, 0x0000ff, 0.99, 0);
                    //this.drawClipperPaths(sol_pathsHoles, 0xff0000, 0.99, 0);
                }
                
                // remove holes from each path even though that's redundant
                // Three.js seems to handle this ok as when it calculates triangles
                // it just sees the hole is nowhere near the triangles and moves on
                var mesh = this.createClipperPathsAsMesh(sol_pathsOuter, this.colorSignal, this.opacitySignal, sol_pathsHoles);
                // slide signal wire down a tinge on z
                // to make rendering prettier
                //mesh.position.set(0, 0, -0.00001);
                
                bigSceneGroup.add (mesh);

                // on layers other than top, we have to possibly apply a rotation/flip
                //debugger;
                /*
                if (layer == "Bottom") {
                    // flip in Y axis
                    var mS = (new THREE.Matrix4()).identity();
                    //set -1 to the corresponding axis
                    mS.elements[0] = -1;
                    //mS.elements[5] = -1;
                    //mS.elements[10] = -1;

                    mesh.applyMatrix(mS);
                }*/

                // FINALLY. AFTER ALL THAT WORK. LETS ACTUALLY SHOW THE DARN USER THE
                // BEAUTIFUL 3D OBJECTS WE CREATED
                mesh.position.set(0,0,-0.00001);
                //this.sceneAdd(mesh);
                
                // add userData for intersect
                mesh.userData.type = "signal";
                mesh.userData.name = signalKey;
                //mesh.userData.wire = wire;
                mesh.userData.signalKey = signalKey;
                mesh.userData.layerWires = layerWires;
                mesh.userData.signalLayers = signalLayers;
                mesh.userData.layerItems = layerItems;
                mesh.userData.layer = layer;
                //mesh.computeFaceNormals();
                //console.log("just added signal mesh to intersectObjects. mesh:", mesh);
                this.intersectObjects.push(mesh);

                // create record of this union'ed signal wire
                var ctr = 0;
                sol_paths.forEach(function (path) {
                    that.clipperSignalWires[signalKey + "-" + ctr] = path;
                    ctr++;
                });

                // add to mondo object
                this.clipperBySignalKey[signalKey].wire = {
                    clipper: sol_paths,
                    wires: layerWires,
                    threeObj: mesh
                };

            }
            
            console.log("SignalWires mesh:  ", mesh, "  group:  ", bigSceneGroup);
            
            //V5.1D20161229 - commented (incomplete experimental mirror code)
            /*
            var rFlip = (Math.PI / 180) * 180;
            var axisFlip = new THREE.Vector3(0, 1, 0);
            if (this.activeLayer == 'Bottom' && this.flipTheBoard == true) { //If bottom layer flip board
                //console.log("ray: Bottom Flip Signals");
                that.rotateAroundObjectAxis(bigSceneGroup, axisFlip, rFlip);
                //placeholder for translating object by x or y board length
            } //signals flip code
            */
            
            that.sceneAdd(bigSceneGroup);
            
            
            console.log("final list of clipper signal wires:", this.clipperSignalWires);
            console.log("this.clipperBySignalKey[]:", this.clipperBySignalKey);
            console.groupEnd();
        },
        draw3dSignalPolygons: function (layer) {

            if (!layer) {
                return;
            }

            console.group("draw3dSignalPolygons");
            console.log("layer:", layer);
            
            var layerNumber = layer.number;
            // contains all paths for each individual polygon
            // so we can join them at the end
            var polyArr = [];

            for (var signalKey in this.eagle.signalItems) {
                var signalLayers = this.eagle.signalItems[signalKey],
                    layerItems = signalLayers[layer.number];
                if (!layerItems) {
                    continue;
                }
                //console.log("layerItems:", layerItems);
                var layerPolys = layerItems['polygons'] || [];
                
                if (layerPolys.length == 0) continue;
                console.log("layerPolys:", layerPolys);
                
                // create mondo storage
                if (this.clipperBySignalKey[signalKey] === undefined)
                    this.clipperBySignalKey[signalKey] = {};
                this.clipperBySignalKey[signalKey].layer = layer;
                //this.clipperBySignalKey[signalKey].polys = [];
                
                var that = this;

                // centipede is not the right reference here, but
                // if the user did multiple polygon pours for this signalKey,
                // i.e. GND, then we want all of these to act like one
                // clipper path with multiple polygons
                var centipede = [];
                
                if (layerPolys.length > 1) {
                    //console.error("have more than one polygon in a signal. need to test this. layerPolys:", layerPolys);
                }
                console.log("layerPolys=", layerPolys.length);
                layerPolys.forEach(function (poly) {

                    var clipperPoly = [];
                    
                    //V5.3 Updated to support curved ploygons
                    var l = poly.vertices.length;
                    for(var i=0; i<l;i++){
                        if(poly.vertices[i].curve == 0)
                            clipperPoly.push({
                                X:that.flipX(poly.vertices[i].x), 
                                Y:that.flipY(poly.vertices[i].y)}); //V5.1D20161229 - flipX/flipY added
                        else {
                            var j = i == l-1 ? 0 : i+1;
                            var arc = that.drawArc(
                                poly.vertices[i].x, poly.vertices[i].y, 
                                poly.vertices[j].x, poly.vertices[j].y,
                                poly.vertices[i].curve, 0);
                            arc.updateMatrixWorld();
                            for(var n = 0; n < arc.geometry.vertices.length - 1; n++){
                                var v = arc.geometry.vertices[n].clone();
                                var ver = arc.localToWorld(v);
                                clipperPoly.push({X:that.flipX(ver.x), Y:that.flipY(ver.y)});
                            }
                        }
                    }
                    
                    // store in eagle obj for retrieval from mondo object
                    // later
                    poly.clipper = clipperPoly;    
                    
                    // not sure if merging these will work if multiple
                    // polys in one signal with different ranks,
                    // will have to test
                    centipede.push(clipperPoly);                   

                });
                console.log("poly centipede:", centipede);
                
                // merge centipede array of signals into single object
                // do a union with Clipper.js
                var sol_paths = this.getUnionOfClipperPaths(centipede);
                //this.drawClipperPaths(sol_paths, this.colorSignal, 0.2);
                var mesh = this.createClipperPathsAsMesh(sol_paths, this.colorSignal, this.opacitySignal * 0.6);
                // slide signal wire down a tinge on z
                // to make rendering prettier
                mesh.position.set(0,0,0.00001);
                
                //V5.1D20161229 - commented (incomplete experimental mirror code)
                /*
                var rFlip = (Math.PI / 180) * 180;
                var axisFlip = new THREE.Vector3(0, 1, 0);
                if (this.activeLayer == 'Bottom' && this.flipTheBoard == true) { //If bottom layer flip board
                    console.log("ray: Bottom Flip Polygons");
                    that.rotateAroundObjectAxis(mesh, axisFlip, rFlip);
                    //placeholder for translating object by x or y board length
                }   //polygons flip code
                */
                
                this.sceneAdd(mesh);
                
                // add userData for intersect
                mesh.userData.type = "poly";
                mesh.userData.name = signalKey;
                //mesh.userData.wire = wire;
                mesh.userData.signalKey = signalKey;
                mesh.userData.layerWires = layerPolys;
                mesh.userData.signalLayers = signalLayers;
                mesh.userData.layerItems = layerItems;
                mesh.userData.layer = layer;
                //mesh.computeFaceNormals();
                //console.log("just added signal mesh to intersectObjects. mesh:", mesh);
                //this.intersectObjects.push(mesh);

                // create record of this union'ed signal wire
                var ctr = 0;
                sol_paths.forEach(function (path) {
                    that.clipperSignalPolys[signalKey + "-" + ctr] = path;
                    ctr++;
                });
                // add to mondo object
                this.clipperBySignalKey[signalKey].poly = {
                    clipper: sol_paths,
                    polys: layerPolys,
                    threeObj: mesh
                };

            }
            console.log("final list of clipper signal polys:", this.clipperSignalPolys);
            console.log("clipperBySignalKey:", this.clipperBySignalKey);
            console.groupEnd();
        },
        clipperElements: [], // holds clipper formatted paths
        clipperPads: [], // subset of elements (pads)
        clipperSmds: [], // subset of elements (smds)
        clipperVias: [], // subset of elements (vias)
        //drillPads: {}, // save all pad drill vectors //V5.2D20170105 Commented replaced by holesToDrill/holesToMill
        //drillVias: {}, // save all via drill vectors //V5.2D20170105 Commented replaced by holesToDrill/holesToMill
        holesToDrill: {}, //V5.2D20170105 Added to replace drillPads/drillVias
        holesToMill: [],  //V5.2D20170105 Added to replace drillPads/drillVias
        holesUnhandledCount: 0, //V5.2D20170105 Count number of holes that cannot be drilled/milled 
                                //(drill diameter > drillMaxDiameter and <= millDiameter)
        addHole: function(drill, x, y){//V5.2D20170105 Added
            if(drill > this.drillMaxDiameter && drill <= this.millDiameterMin){
                this.holesUnhandledCount++
                return false; //We don't have tool suitable for this hole.
            }
            if(drill > this.drillMaxDiameter) {//Hole diameter bigger tham drillMaxDiameter, mill it
                this.holesToMill.push({
                   X: x.toFixed(4),
                   Y: y.toFixed(4),
                   D: drill.toFixed(4)
                });
            }
            else {//Hole diameter smaller or equel to drillMaxDiameter, drill it
                if(this.holesToDrill[drill.toFixed(1)] === undefined)
                   this.holesToDrill[drill.toFixed(1)] = [];
                this.holesToDrill[drill.toFixed(1)].push({
                   X: x.toFixed(4),
                   Y: y.toFixed(4),
                   D: drill.toFixed(4)
                });
            }
            return true;
        },
        
        draw3dElements: function (layer) {

            if (!layer) return;

            console.group("draw3dElements");

            var that = this;
            
            var bigSceneGroup = new THREE.Group();

            for (var elemKey in this.eagle.elements) {
                var elem = this.eagle.elements[elemKey];
                console.log("working on element:", elem);
                console.log("ray: elemKey:  ", elemKey, "  elem.mirror:  ", elem.mirror);
                console.log("activeLayer:  ", this.activeLayer)
                // var renderThisPad;
                // if ((elem.mirror == false && this.activeLayer == 'Top') || (elem.mirror == true && this.activeLayer == 'Bottom')  )
                // { //|| (pad.drill && pad.drill > 0)
                // 	renderThisPad = true;
                // 	console.log ("ray:  this part is on the active layer:", elemKey);
                // }
                // else
                // {
                // 	renderThisPad = false;
                // }
                // console.log("pad.drill = ");  //, pad.drill
                // //renderThisPad = true;
				
                // store clipper formatted points for this element
                //this.clipperElements[elemKey] = [];
								
                var pkg = this.eagle.packagesByName[elem.pkg];
                var rotMat = elem.matrix;
								
                // loop thru smds
                var padCtr = 0;
                var smdgroup = new THREE.Object3D();
								
                // insert smdgroup three.js obj into pkg
                //pkg["threeObj"] = smdgroup;
                elem["threeObj"] = {};
                elem["threeObj"]["smdgroup"] = smdgroup;
                elem["threeObj"]["smds"] = {};

                // CALCULATING SMDS
                // if (renderThisPad ) {
                pkg.smds.forEach(function (smd) {
                    var smdLayer = elem.mirror? 17 - parseInt(smd.layer, 10): smd.layer;
                    // if(((!elem.mirror) && layer.number == smd.layer) || (elem.mirror && layer.number != smd.layer)){
                    if(layer.number == smdLayer){
                        console.log("drawing smd:", smd);
                        var layerNum = smd.layer;
    
                        /*
                        if (elem.mirror) {
                            console.log("mirror, since this elem is mirrored, we're getting the mirrorLayer from the eagle object. layerNum prior:", layerNum);
                            layerNum = this.eagle.mirrorLayer(layerNum);
                            console.log("mirror layerNum after:", layerNum);
                        }
                        */
                        /*
                        if (layer.number != layerNum) {
                            return;
                        }*/
    
                        var lineGeo = new THREE.Geometry();
                        var w2 = smd.dx / 2;
                        var h2 = smd.dy / 2;
                        if('roundness' in smd && smd.roundness != null){
                            var c2 = Math.min(h2, w2) * smd.roundness / 100;
    
                            var cPoints = that.createArcPoints(-(w2-c2), -(h2-c2), c2, 180, 270);
                            cPoints.forEach(function(p){
                                lineGeo.vertices.push(new THREE.Vector3(p.x, p.y, 0));
                            });
                            
                            cPoints = that.createArcPoints((w2-c2), -(h2-c2), c2, 270, 360);
                            cPoints.forEach(function(p){
                                lineGeo.vertices.push(new THREE.Vector3(p.x, p.y, 0));
                            });
                            
                            cPoints = that.createArcPoints((w2-c2), (h2-c2), c2, 0, 90);
                            cPoints.forEach(function(p){
                                lineGeo.vertices.push(new THREE.Vector3(p.x, p.y, 0));
                            });
                            
                            cPoints = that.createArcPoints(-(w2-c2), (h2-c2), c2, 90, 180);
                            cPoints.forEach(function(p){
                                lineGeo.vertices.push(new THREE.Vector3(p.x, p.y, 0));
                            });
                        console.log("AmeenX", "round SMD ------------------------" );
                        }
                        else {
                            lineGeo.vertices.push(new THREE.Vector3(w2 * -1, h2 * -1, 0));
                            lineGeo.vertices.push(new THREE.Vector3(w2, h2 * -1, 0));
                            lineGeo.vertices.push(new THREE.Vector3(w2, h2, 0));
                            lineGeo.vertices.push(new THREE.Vector3(w2 * -1, h2, 0));
                            // close it by connecting last point to 1st point
                            lineGeo.vertices.push(new THREE.Vector3(w2 * -1, h2 * -1, 0));
                        }
    
                        lineGeo = that.getPadGeometryIntersectedWithPolygon(pkg.polygons, lineGeo, layer.number);
                        
                        var lineMat = new THREE.LineBasicMaterial({
                            color: that.colorSignal,
                            transparent: true,
                            opacity: 0.2
                        });
                        var line = new THREE.Line(lineGeo, lineMat);
    
                        // do smd as mesh instead
                        lineMat = new THREE.MeshBasicMaterial({
                            color: that.colorSignal,
                            transparent: true,
                            opacity: 0.2,
                            side: THREE.DoubleSide,
                            //overdraw: false,
                            //polygonOffset: true,
                            depthWrite: false
                        });
                        //lineMat.side = THREE.DoubleSided;
                        var holes = [];
                        var triangles = THREE.ShapeUtils.triangulateShape(lineGeo.vertices, holes); //changed Shape.Utils to ShapeUtils per new Three revision
    
                        for (var i = 0; i < triangles.length; i++) {
    
                            lineGeo.faces.push(new THREE.Face3(triangles[i][0], triangles[i][1], triangles[i][2]));
    
                        }
                        //lineGeo.faces.push( new THREE.Face3( 0, 1, 2 ) );
                        lineGeo.computeFaceNormals();
                        line = new THREE.Mesh(lineGeo, lineMat);
    
                        // add smd mesh to be found on mouse movements
                        this.intersectObjects.push(line);
    
                        // rotate
                        // now that the smd is drawn, apply its individual
                        // rotation
                        if ('rot' in smd && smd.rot != null) {
                            var rot = parseInt(smd.rot.replace(/R/i, ""));
                            //console.log("will rotate individual smd by deg:", rot);
                            if (rot > 0) {
                                var r = (Math.PI / 180) * rot;
                                //console.log("we are rotating individual smd by radians:", r);
                                var axis = new THREE.Vector3(0, 0, 1);
                                that.rotateAroundObjectAxis(line, axis, r);
                            }
                        }
    
                        // set smd's x/y
                        line.position.set(smd.x, smd.y, 0);
                        line.userData["smdName"] = smd.name;
                        line.userData["smd"] = smd;
                        //line.userData["elemKey"] = elemKey;
                        line.userData["elem"] = elem;
                        //line.userData['pkgKey'] = elem.pkg;
                        line.userData['pkg'] = pkg;
                        line.userData["type"] = "smd";
                        //console.log("adding smd line with userData:", line);
    
                        // add this three.js obj to smd
                        //smd["threeObj"] = line;
                        elem["threeObj"]["smds"][smd.name] = line;
    
                        smdgroup.add(line);
                        //that.sceneAdd(line);
                        //group.add(line);
    
                        padCtr++;

                    }
                }, this);
                /*
                if (elem.rot.match(/M/i)) {
                  var axis = new THREE.Vector3(0, 1, 0);
                       var r = (Math.PI / 180) * 180;
                       that.rotateAroundObjectAxis(padgroup, axis, r);
                       console.log ("ray: M matched");

                }*/
                //var t = "M270"; console.log( parseInt(t.replace(/\D+/i,'')) )

                // now rotate and position the smdgroup
                //smdgroup
                if ('rot' in elem && elem.rot != null) {
                    //var rot = parseInt(elem.rot.replace(/R/i, ""));
                    var rot = parseInt(elem.rot.replace(/\D+/i,''));

                    console.log("will rotate pkg smd by deg:", rot);
                    if (rot > 0) {
                        var r = (Math.PI / 180) * rot;
                        //console.log("we are rotating pkg smd by radians:", r);
                        var axis = new THREE.Vector3(0, 0, 1);
                        that.rotateAroundObjectAxis(smdgroup, axis, r);
                    }
                }
                

                // see if smd group is mirrored
                //console.log("checking if elem is mirrored. elem:", elem);


                /*
                if (elem.rot.match(/M/i)) {
                  var axis = new THREE.Vector3(0, 1, 0);
                       that.rotateAroundObjectAxis(padgroup, axis, 180);
                       console.log ("ray: M matched");

                }
                */

                
                if (elem.mirror) {
                    //console.log("smdgroup elem is mirrored");
                    var mS = (new THREE.Matrix4()).identity();
                    //set -1 to the corresponding axis
                    mS.elements[0] = -1;
                    //mS.elements[5] = -1;
                    //mS.elements[10] = -1;
                    
                    smdgroup.applyMatrix(mS);
                    //mesh.applyMatrix(mS);
                    //object.applyMatrix(mS);
                }
                
                // } // (if renderThisPad) ends here
                
                that.flipObject3D(smdgroup); //V5.1D20161229 - Added
                
                // set position
                smdgroup.position.set(that.flipX(elem.x), that.flipY(elem.y), 0); //V5.1D20161229 - flipX/flipY added
                //that.sceneAdd(smdgroup);
                bigSceneGroup.add (smdgroup);
                

                // store as a clipper path for later union'ing
                var temparr = [];
                // store clipper union'ed smds into elem
                elem["threeObj"]["smdsClipperFmt"] = {};
                smdgroup.updateMatrixWorld();
                var lineCtr = 0;
                smdgroup.children.forEach(function (line) {
                    //console.log("line in group:", line);
                    temparr[lineCtr] = [];
                    line.geometry.vertices.forEach(function (v) {
                        //line.updateMatrixWorld();
                        //console.log("pushing v onto clipper:", v);
                        var vector = v.clone();
                        //vector.applyMatrix( group.matrixWorld );
                        var vec = line.localToWorld(vector);
                        if (!(elemKey + "-" + lineCtr in this.clipperElements)) this.clipperElements[elemKey + "-" + lineCtr] = [];
                        this.clipperElements[elemKey + "-" + lineCtr].push({
                            X: vec.x,
                            Y: vec.y
                        });
                        temparr[lineCtr].push({
                            X: vec.x,
                            Y: vec.y
                        });
                        elem["threeObj"]["smdsClipperFmt"][line.userData.smd.name] = temparr[lineCtr];
                        
                    }, this);
                    
                    // push onto mondo object, which is sorted by signal name
                    // so we're pushing an smd into an alternate hierarchy
                    var ud = line.userData;
                    var signalKey = ud.elem.padSignals[ud.smd.name];
                    if(signalKey === undefined || signalKey == "undefined") signalKey = ud.smd.name; //UndefinedFix
                    // add to mondo object
                    if (this.clipperBySignalKey[signalKey] === undefined)
                        this.clipperBySignalKey[signalKey] = {};
                    if (this.clipperBySignalKey[signalKey].smds === undefined)
                        this.clipperBySignalKey[signalKey].smds = [];
                    var clipperPath = temparr[lineCtr];
                    // remove last point because it closes the object, but on clipper
                    // paths it assumes to close the polygon
                    clipperPath.pop();
                    this.clipperBySignalKey[signalKey].smds.push({
                        clipper: temparr[lineCtr],
                        smd: ud.smd,
                        threeObj: line,
                        threeObjSmdGroup: smdgroup
                    });
                    
                    lineCtr++;
                }, this);
								
                // draw temp union of smd
                temparr.forEach(function (d) {
                    this.clipperSmds.push(d);
                    
                }, this);
                
                //this.clipperSmds.push(temparr);
                //console.log("just stored clipperSmds:", this.clipperSmds);
                /*
                console.log("temparr:", temparr);
                var sol_paths = this.getUnionOfClipperPaths(temparr);
                var infl_path = this.getInflatePath(sol_paths, 0.1);
                this.drawClipperPaths(infl_path, 0x00ffff, 1.0);
                */

                // CALCULATING PADS
                
                // do pads
                
                var padgroup = new THREE.Object3D();
                elem["threeObj"]["padgroup"] = padgroup;
                elem["threeObj"]["pads"] = {};
                elem["threeObj"]["padsAsLines"] = {};
                elem["threeObj"]["padsAsMesh"] = {};
                
                //if (renderThisPad) {
                pkg.pads.forEach(function (pad) {
                    console.log("working on pad for layer. pad:", pad, "layer:", layer);


                    // pads are circles by default, but could be squares or octagons
                    var group = new THREE.Object3D();
                    //var groupMesh = new THREE.Object3D();

                    elem["threeObj"]["padsAsLines"][pad.name] = group;

                    elem["threeObj"]["padsAsMesh"][pad.name] = null;

                    var diameter;
                    if (that.activeLayer == "Top")
                        diameter = pad.diameterTop;
                    else if (that.activeLayer == "Bottom")
                        diameter = pad.diameterBottom;
                    else
                        diameter = pad.diameterInner;
                        
                    var lineGeo;
                    var lineMat = new THREE.LineBasicMaterial({
                        color: that.colorPad,
                        transparent: true,
                        opacity: 0.2
                    });
                    if (pad.shape == "square") {
                         lineGeo = new THREE.Geometry();
                        // var w = pad.diameter / 2;
                        var w = diameter / 2;

                        lineGeo.vertices.push(new THREE.Vector3(0 - w, 0 - w, 0));
                        lineGeo.vertices.push(new THREE.Vector3(0 + w, 0 - w, 0));
                        lineGeo.vertices.push(new THREE.Vector3(0 + w, 0 + w, 0));
                        lineGeo.vertices.push(new THREE.Vector3(0 - w, 0 + w, 0));
                        // close it by connecting last point to 1st point
                        lineGeo.vertices.push(new THREE.Vector3(0 - w, 0 - w, 0));
                        
                        // var line = new THREE.Line(lineGeo, lineMat);
                        // group.add(line);

                    } else if (pad.shape == "octagon") {

                        // var radius = pad.diameter / 2;
                        var radius = diameter / 2;
                        var segments = 8; // not 1 extra for center vertex

                        lineGeo = new THREE.CircleGeometry(radius, segments, Math.PI / 8, Math.PI * 2);

                        // Remove center vertex
                        lineGeo.vertices.shift();

                        //var lineCircle = new THREE.Line(geometry, material);

                        //group.add(lineCircle);


                    } else if (pad.shape == "long" || pad.shape == "offset") {

                        // could draw circle top, circle bottom, then square, then do union
                        // var radius = dia / 2;
                        var psLong = pad.shape == "long";
                        var radius = diameter / 2;
                        var segments = 24;
                        var circleGeo = new THREE.CircleGeometry(radius, segments);
                        // Remove center vertex
                        circleGeo.vertices.shift();

                        var circle = new THREE.Line(circleGeo, lineMat);
                        // clone the circle
                        var circle2 = circle.clone();

                        // shift left (rotate 0 is left/right)
                        var shiftX = psLong? radius * -1: radius * 0;
                        //shiftX = shiftX + pad.x;
                        var shiftY = 0;
                        //shiftY = shiftY + pad.y;
                        circle.position.set(shiftX, shiftY, 0);
                        group.add(circle);
                        // shift right
                        var shiftX = psLong? radius * 1: radius * 2;
                        //shiftX = shiftX + pad.x;
                        var shiftY = 0;
                        //shiftY = shiftY + pad.y;
                        circle2.position.set(shiftX, shiftY, 0);
                        group.add(circle2);

                        // add a square to middle
                        lineGeo = new THREE.Geometry();
                        // w = w / 2;
                        var w = diameter / 2;
                        var a = psLong? w: 0;
                        var b = psLong? w: w * 2;
                        lineGeo.vertices.push(new THREE.Vector3(0 - a, 0 - w, 0));
                        lineGeo.vertices.push(new THREE.Vector3(0 + b, 0 - w, 0));
                        lineGeo.vertices.push(new THREE.Vector3(0 + b, 0 + w, 0));
                        lineGeo.vertices.push(new THREE.Vector3(0 - a, 0 + w, 0));
                        // close it by connecting last point to 1st point
                        lineGeo.vertices.push(new THREE.Vector3(0 - a, 0 - w, 0));
                        //var line = new THREE.Line(lineGeo, lineMat);
                        //group.position.set(pad.x, pad.y, 0);
                        //group.add(line);

                    } else {
                        // var radius = pad.diameter / 2,
                        var radius = diameter / 2;
                            segments = 32;
                        lineGeo = new THREE.CircleGeometry(radius, segments);

                        // Remove center vertex
                        lineGeo.vertices.shift();

                        // shift to xy pos
                        //var lineCircle = new THREE.Line(geometry, material);
                        //lineCircle.position.set(pad.x, pad.y, 0);

                        //lineCircle.rotateX(90);

                        //that.sceneAdd( lineCircle );
                        //group.add(lineCircle);
                    }
                    lineGeo = that.getPadGeometryIntersectedWithPolygon(pkg.polygons, lineGeo, layer.number);
                    
                    var line = new THREE.Line(lineGeo, lineMat);
                    group.add(line);
                    
                    // now draw the drill as dimension (not as standalone)
                    /*
                    var radius = pad.drill / 2;
                    var segments = 24;
                    var circleGeo = new THREE.CircleGeometry(radius, segments);
                    circleGeo.vertices.shift(); // remove center vertex
                    var drillMat = new THREE.LineBasicMaterial({
                        color: that.colorHole,
                    });
                    var drillLine = new THREE.Line(circleGeo, drillMat);
                    drillLine.position.set(elem.x + pad.x, elem.y + pad.y, 0);
                    drillLine.userData["type"] = "drill";

                    group.add(drillLine);
                    //that.sceneAdd(drillLine);
                    */

                    // now that the pad is drawn, apply its individual
                    // rotation
                    if ('rot' in pad && pad.rot != null) {
                        var rot = parseInt(pad.rot.replace(/R/i, ""));
                        //console.log("will rotate individual pad by deg:", rot);
                        if (rot > 0) {
                            var r = (Math.PI / 180) * rot;
                            //console.log("we are rotating individual pad by radians:", r);
                            var axis = new THREE.Vector3(0, 0, 1);
                            that.rotateAroundObjectAxis(group, axis, r);
                        }
                    }

                    // set pad's x/y
                    group.position.set(pad.x, pad.y, 0);

                    // set some userData on group for this pad
                    group.userData["type"] = "pad";
                    group.userData["elem"] = elem;
                    group.userData["pkg"] = pkg;
                    group.userData["pad"] = pad;

                    // ok, finally add to padgroup
                    padgroup.add(group);

                });
                

                // now position the pads for the element's pos, mirror, and rotation
                
                // see if padgroup rotated
                if (elem.rot.match(/R(\d+)/i)) {
                    // there is a rotation
                    var rotTxt = RegExp.$1;
                    var rot = parseInt(rotTxt);
                    console.log("padgroup: will rotate pad by deg:", rot);
                    if (rot > 0) {
                        var r = (Math.PI / 180) * rot;
                        //console.log("we are rotating by radians:", r);
                        var axis = new THREE.Vector3(0, 0, 1);
                        that.rotateAroundObjectAxis(padgroup, axis, r);
                    }
                }
                

                // see if pad group is mirrored
                //console.log("checking if pad elem is mirrored. elem:", elem);
                if (elem.mirror) {
                    //console.log("padgroup:  elem is mirrored. elem:", elem, "pkg:", pkg);
                    var mS = (new THREE.Matrix4()).identity();
                    //set -1 to the corresponding axis
                    mS.elements[0] = -1;
                    //mS.elements[5] = -1;
                    //mS.elements[10] = -1;
                    
                    padgroup.applyMatrix(mS);
                    //mesh.applyMatrix(mS);
                    //object.applyMatrix(mS);
                }
                //} // (if renderThisPad) ends here

                that.flipObject3D(padgroup); //V5.1D20161229 - Added
                // set padgroup's x/y
                padgroup.position.set(that.flipX(elem.x), that.flipY(elem.y), 0);//V5.1D20161229 - flipX/flipY added
                //that.sceneAdd(padgroup);
                
                // Now convert the Three.js drawn padgroup to a Clipper path
                // so we can do cool stuff like inflate/deflate and union/intersect
                // it. To convert we need to updateMatrixWorld() for three.js to calculate
                // all the absolute coordinates for us.
                
                // add to Clipper list for later union'ing
                //console.log("group vertices:", padgroup);
                padgroup.updateMatrixWorld();
                var temparr = [];
                var padCtr = 0;
                var lineCtr = 0;
                padgroup.children.forEach(function (group) {
                    group.updateMatrixWorld();

                    // store the vertices into this mesh
                    // array. we'll union them and then
                    // create a mesh. then subtract the drill
                    var meshArr = [];
                    var meshHoleArr = [];
                    var meshCtr = 0;

                    group.children.forEach(function (line) {
                        //console.log("line in group:", line);
                        temparr[lineCtr] = [];
                        var firstMeshPt = null;
                        var firstMeshHolePt = null;
                        meshArr[meshCtr] = [];

                        // Get absolute coordinates from drill hole
                        // in an element
                        //V5.2D20170105 commented
                        // if( line.position.x == 0 ){ // only middle point holes
                        //   var vector = new THREE.Vector3();
                        //   vector.setFromMatrixPosition( line.matrixWorld  );
                        //   // Most exists only drills with diameter 1.0 0.9 0.8 ...
                        //   var drill = line.parent.userData.pad.drill;
                        //   var shape = line.parent.userData.pad.shape;
                        //   if(this.drillPads[drill.toFixed(1)] === undefined)
                        //       this.drillPads[drill.toFixed(1)] = [];
                        //   this.drillPads[drill.toFixed(1)].push({
                        //       X: vector.x.toFixed(4),
                        //       Y: vector.y.toFixed(4),
                        //       D: drill.toFixed(4)
                        //   });
                        //   // New routine to draw a cirlce in threed
                        //   //this.sceneAdd( this.drawCircle(vector.x, vector.y, drill/2, this.colorHole ) );
                        //   //bigSceneGroup.add (this.drawCircle(vector.x, vector.y, drill / 2, this.colorHole));

                        //   // drill hole --> end
                        //  }
                         //V5.2D20170105 holes handling --> replace above code
                         if( line.position.x == 0 ){ // only middle point holes
                           var vector = new THREE.Vector3();
                           vector.setFromMatrixPosition( line.matrixWorld  );
                           var drill = line.parent.userData.pad.drill;
                           var shape = line.parent.userData.pad.shape;
                           var colorHole = this.colorHole;
                           if(!this.addHole(drill, vector.x, vector.y)) colorHole = this.colorHoleUnhandled; //Red
                           // New routine to draw a cirlce in threed
                           //this.sceneAdd( this.drawCircle(vector.x, vector.y, drill/2, this.colorHole ) );
                           bigSceneGroup.add (this.drawCircle(vector.x, vector.y, drill / 2, colorHole));

                           // holes handling --> end
                             
                         }
                        line.geometry.vertices.forEach(function (v) {
                            //console.log("pushing v onto clipper:", v);
                            var vector = v.clone();
                            //vector.applyMatrix( group.matrixWorld );
                            var vec = line.localToWorld(vector);
                            if (!(elemKey + "-" + lineCtr in this.clipperElements)) 
                              this.clipperElements[elemKey + "-" + lineCtr] = [];

                            this.clipperElements[elemKey + "-" + lineCtr].push({
                                X: vec.x,
                                Y: vec.y
                            });
                            temparr[lineCtr].push({
                                X: vec.x,
                                Y: vec.y
                            });
                            //elem["threeObj"]["pads"]
                            var ptxy = {
                                X: vec.x,
                                Y: vec.y
                            };
                            if (line.userData.type == "drill") {

                                meshHoleArr.push(ptxy);
                                if (firstMeshHolePt == null) firstMeshHolePt = ptxy;
                            } else {
                                meshArr[meshCtr].push(ptxy);
                                if (firstMeshPt == null) firstMeshPt = ptxy;
                            }
                        }, this);
                        meshCtr++;
                        // close the mesh and the hole
                        //if (firstMeshPt != null) meshArr.push(firstMeshPt);
                        //if (firstMeshHolePt != null) meshHoleArr.push(firstMeshHolePt);

                        lineCtr++;
                    }, this);

                    //console.log("creating pad mesh for pad:");
                    var shape = new THREE.Shape();
                    
                    // create a mesh for each group
                    //var lineGeo = new THREE.Geometry();
                    // we need to union the mesh first cuz it
                    // could have sub-components like on long pads
                    var sol_paths = this.getUnionOfClipperPaths(meshArr);
                    var clipperOuterPath = sol_paths[0];
                    //console.log("unionized mesh pts for meshArr:", sol_paths);
                    var ptCtr = 0;
                    sol_paths[0].forEach(function (pt) {
                        if (ptCtr == 0) shape.moveTo(pt.X, pt.Y);
                        else shape.lineTo(pt.X, pt.Y);
                        //lineGeo.vertices.push(new THREE.Vector3(pt.X, pt.Y, 0));
                        ptCtr++;
                    }, this);
                    //lineGeo.vertices.pop();
                    // add first pt to close shape
                    //lineGeo.vertices.push(new THREE.Vector3(sol_paths[0][0].X, sol_paths[0][0].Y, 0));

                    /*
                    var lineMat = new THREE.LineBasicMaterial({
                        color: that.colorDimension,
                        transparent: true,
                        opacity: 0.5
                    });
                    var lines = new THREE.Line(lineGeo, lineMat);
                    */
                    //this.sceneAdd(lines);

                    //var holeGeo = new THREE.Geometry();
                    var hole = new THREE.Path();
                    // console.log("about to calc holes. meshHoleArr:", meshHoleArr);

                    if (meshHoleArr.length > 0) {
                        var sol_paths = this.getUnionOfClipperPaths([meshHoleArr]);
                        //console.log("unionized mesh pts for meshHoleArr:", sol_paths);
                        var ptCtr = 0;
                        //var revArr = sol_paths[0].reverse();
                        sol_paths[0].forEach(function (pt) {
                            //holeGeo.vertices.push(new THREE.Vector3(pt.X, pt.Y, 0));
                            if (ptCtr == 0) hole.moveTo(pt.X, pt.Y);
                            else hole.lineTo(pt.X, pt.Y);
                            ptCtr++;
                        }, this);
                        shape.holes.push(hole);
                    }
                    //holeGeo.vertices.pop(); // remove last duplicate
                    // add first pt to close hole
                    //if (meshHoleArr.length > 0)
                    //    holeGeo.vertices.push(new THREE.Vector3(meshHoleArr[0].X, meshHoleArr[0].Y, 0));
                    //var holeLines = new THREE.Line(holeGeo, lineMat);
                    //this.sceneAdd(holeLines);

                    // create mesh version
                    var meshMat = new THREE.MeshBasicMaterial({
                        color: that.colorPad,
                        transparent: true,
                        opacity: 0.2,
                        side: THREE.DoubleSide,
                        depthWrite: false // so don't get rendering artifacts
                    });
                    //lineMat.side = THREE.DoubleSided;
                    //var holes = [];

                    /*
                    console.log("about to triangulate pad mesh - holes. pad:", lineGeo, "holes:", holeGeo);
                    var triangles = THREE.Shape.Utils.triangulateShape(lineGeo.vertices, [holeGeo.vertices]);
                    console.log("triangles after calculating pad and remove holes:", triangles);
                    for (var i = 0; i < triangles.length; i++) {

                        lineGeo.faces.push(new THREE.Face3(triangles[i][0], triangles[i][1], triangles[i][2]));

                    }
                    //lineGeo.faces.push( new THREE.Face3( 0, 1, 2 ) );
                    lineGeo.computeFaceNormals();
                    var mesh = new THREE.Mesh(lineGeo, meshMat);
                    */

                    // using shape instead
                    var geometry = new THREE.ShapeGeometry( shape );
                    //var material = new THREE.MeshBasicMaterial({color:0xffccff, side:2, overdraw:true} );
                    var mesh = new THREE.Mesh(geometry, meshMat );
                    
                    // we now have a mesh representation of this
                    // pad. let's save it for later use.
                    //console.log("done working on pad mesh:", mesh);
                    elem["threeObj"]["padsAsMesh"][group.userData.pad.name] = mesh;
                    mesh.userData["type"] = "pad";
                    mesh.userData["elem"] = group.userData.elem;
                    mesh.userData["pkg"] = group.userData.pkg;
                    mesh.userData["pad"] = group.userData.pad;
                    
                    bigSceneGroup.add (mesh);
                    //this.sceneAdd(mesh);
                    
                    // add that these get detected during
                    // mouseover
                    this.intersectObjects.push(mesh);

                    // push onto mondo object, which is sorted by signal name
                    // so we're pushing an smd into an alternate hierarchy
                    var ud = mesh.userData;
                    var signalKey = ud.elem.padSignals[ud.pad.name];
                    if (signalKey == undefined) signalKey = ud.pad.name; //UndefinedFix
                    // add to mondo object
                    if (this.clipperBySignalKey[signalKey] === undefined)
                        this.clipperBySignalKey[signalKey] = {};
                    if (this.clipperBySignalKey[signalKey].pads === undefined)
                        this.clipperBySignalKey[signalKey].pads = [];
                    this.clipperBySignalKey[signalKey].pads.push({
                        clipper: clipperOuterPath,
                        pad: ud.pad,
                        threeObj: mesh,
                        threeObjPadGroup: padgroup
                    });
                    
                }, this);
                // draw temp union of padgroup
                temparr.forEach(function (d) {
                    this.clipperPads.push(d);
                }, this);
                /*
                console.log("padgroup temparr:", temparr);
                var sol_paths = this.getUnionOfClipperPaths(temparr);
                var infl_path = this.getInflatePath(sol_paths, 0.1);
                this.drawClipperPaths(infl_path, 0x00ffff, 1.0);
                */

                // so far wires in a pkg are for tPlace and tDocu, not
                // for milling, so not an important part to solve
                pkg.wires.forEach(function (wire) {
                    var layerNum = wire.layer;

                    if (elem.mirror) {
                        layerNum = this.eagle.mirrorLayer(layerNum);
                    }
                    if (layer.number != layerNum) {
                        return;
                    }
                    //console.log("pkg wire:", wire);

                    var x1 = elem.x + rotMat[0] * wire.x1 + rotMat[1] * wire.y1,
                        y1 = elem.y + rotMat[2] * wire.x1 + rotMat[3] * wire.y1,
                        x2 = elem.x + rotMat[0] * wire.x2 + rotMat[1] * wire.y2,
                        y2 = elem.y + rotMat[2] * wire.x2 + rotMat[3] * wire.y2;

                    var lineGeo = new THREE.Geometry();
                    lineGeo.vertices.push(new THREE.Vector3(x1, y1, 0));
                    lineGeo.vertices.push(new THREE.Vector3(x2, y2, 0));

                    // close it by connecting last point to 1st point
                    //lineGeo.vertices.push(new THREE.Vector3(x1, y1, 0));
                    if (!color) var color = 0xff0000;
                    var lineMat = new THREE.LineBasicMaterial({
                        color: color,
                        transparent: true,
                        opacity: 0.5
                    });
                    var line = new THREE.Line(lineGeo, lineMat);
                    //that.sceneAdd(line);
                    bigSceneGroup.add (line); 

                }, this);

                /*
                var smashed = elem.smashed,
                    textCollection = smashed ? elem.attributes : pkg.texts; //smashed : use element attributes instead of package texts
                for (var textIdx in textCollection) {
                    var text = textCollection[textIdx];
                    var layerNum = text.layer;
                    if ((!elem.smashed) && (elem.mirror)) { 
                        layerNum = this.mirrorLayer(layerNum); 
                    }
                    if (layer.number != layerNum) { continue; }
                    
                    var content = smashed ? null : text.content,
                        attribNameF = smashed ? text.name : ((text.content.indexOf('>') == 0) ? text.content.substring(1) : null);
                    if (attribName == "NAME")  { content = elem.name;  }
                    if (attribName == "VALUE") { content = elem.value; }
                    if (!content) { continue; }
                    
                    var x = smashed ? text.x : (elem.x + rotMat[0]*text.x + rotMat[1]*text.y),
                        y = smashed ? text.y : (elem.y + rotMat[2]*text.x + rotMat[3]*text.y),
                        rot = smashed ? text.rot : elem.rot,
                        size = text.size;
                    
                    //rotation from 90.1 to 270 causes Eagle to draw labels 180 degrees rotated with top right anchor point
                    var degrees  = parseFloat(rot.substring((rot.indexOf('M')==0) ? 2 : 1)),
                        flipText = ((degrees > 90) && (degrees <=270)),
                        textRot  = this.matrixForRot(rot),
                        fontSize = 10;
                    
                    ctx.save();
                    ctx.fillStyle = color;
                    ctx.font = ''+fontSize+'pt vector'; //Use a regular font size - very small sizes seem to mess up spacing / kerning
                    ctx.translate(x,y);
                    ctx.transform(textRot[0],textRot[2],textRot[1],textRot[3],0,0);
                    var scale = size / fontSize;
                    ctx.scale(scale,-scale);
                    if (flipText) {
                        var metrics = ctx.measureText(content);
                        ctx.translate(metrics.width,-fontSize); //Height is not calculated - we'll use the font's 10pt size and hope it fits
                        ctx.scale(-1,-1);
                    }
                    ctx.fillText(content, 0, 0);
                    ctx.restore();
                }
                */
            }
            
            //V5.1D20161229 - commented (incomplete experimental mirror code)
            /*
            var rFlip = (Math.PI / 180) * 180;
            var axisFlip = new THREE.Vector3(0, 1, 0);
            if (this.activeLayer == 'Bottom' && this.flipTheBoard == true) { //If bottom layer flip board
                console.log("ray: Bottom Flip Element");
                that.rotateAroundObjectAxis(bigSceneGroup, axisFlip, rFlip);
                //placeholder for translating object by x or y board length
            } //Elements flip code
            */
            
            that.sceneAdd(bigSceneGroup);
            
            
            console.log("final list of clipper elements:", this.clipperElements);
            console.log("this.eagle.elements with all threeObjs and clipperPaths", this.eagle.elements);
            console.log("this.clipperBySignalKey", this.clipperBySignalKey);

            console.groupEnd();
        },
        // Rotate an object around an arbitrary axis in object space
        rotObjectMatrix: null,
        rotateAroundObjectAxis: function (object, axis, radians) {
            rotObjectMatrix = new THREE.Matrix4();
            rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

            // old code for Three.JS pre r54:
            // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
            // new code for Three.JS r55+:
            object.matrix.multiply(rotObjectMatrix);

            // old code for Three.js pre r49:
            // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
            // old code for Three.js r50-r58:
            // object.rotation.setEulerFromRotationMatrix(object.matrix);
            // new code for Three.js r59+:
            object.rotation.setFromRotationMatrix(object.matrix);
        },

        rotWorldMatrix: null,
        // Rotate an object around an arbitrary axis in world space       
        rotateAroundWorldAxis: function (object, axis, radians) {
            rotWorldMatrix = new THREE.Matrix4();
            rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

            // old code for Three.JS pre r54:
            //  rotWorldMatrix.multiply(object.matrix);
            // new code for Three.JS r55+:
            rotWorldMatrix.multiply(object.matrix); // pre-multiply

            object.matrix = rotWorldMatrix;

            // old code for Three.js pre r49:
            // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
            // old code for Three.js pre r59:
            // object.rotation.setEulerFromRotationMatrix(object.matrix);
            // code for r59+:
            object.rotation.setFromRotationMatrix(object.matrix);
        },
        boundries: function(){
            return this.blankBoard.use? this.blankBoundaries: this.boardBoundaries;
        },
        //V5.1D20161229 - Added
        /**Recalculate value of X if board is being mirrored*/
        flipX: function (x){
            if (this.mirrorY)
                return this.boundries().MinimumX + this.boundries().MaximumX - x;
            else
                return x;
        },
        //V5.1D20161229 - Added
        /**Recalculate value of Y if board is being mirrored*/
        flipY: function (y){
            if (this.mirrorX)
                return this.boundries().MinimumY + this.boundries().MaximumY - y;
            else
                return y;
        },
        //V5.1D20161229 - Added
        /**Mirror Object3D (smdgroups and padgroups) if board is being mirrored
        this function must be called before setting the position of the group*/
        flipObject3D: function(o){
            if (this.mirrorX || this.mirrorY){
                var mS = (new THREE.Matrix4()).identity();
                //set -1 to the corresponding axis
                if (this.mirrorY) mS.elements[0] = -1;
                if (this.mirrorX) mS.elements[5] = -1;
                //mS.elements[10] = -1;
                        
                o.applyMatrix(mS);
            }
        },
        drawCircle: function (x, y, radius, color, seg, opacity){
            // draw a hole
            seg = seg || 0;
            var trans = (opacity !== undefined);
            var segments = seg>0? seg: Math.max(Math.round(2 * Math.PI * radius) * 10, 32), //V5.3D201701XX changed from fixed 32 segments to dynamic 10 segments per mm
                material = new THREE.LineBasicMaterial( { color: color, transparent: trans, opacity: trans?opacity:1} ),
                geometry = new THREE.CircleGeometry( radius, segments );
            // Remove center vertex
            geometry.vertices.shift();
            
            var circle = new THREE.Line( geometry, material );
            circle.position.set(x, y, 0);

            return circle;
        },
        drawSquare2: function (x, y, w, color){
            var material = new THREE.LineBasicMaterial( { color: color } ),
                geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(0 - w,  0 - w, 0.0));
            geometry.vertices.push(new THREE.Vector3(0 - w,  0 + w, 0.0));
            geometry.vertices.push(new THREE.Vector3(0 + w,  0 + w, 0.0));
            geometry.vertices.push(new THREE.Vector3(0 + w,  0 - w, 0.0));
            geometry.vertices.push(new THREE.Vector3(0 - w,  0 - w, 0.0));
            var square = new THREE.Line( geometry, material );
            square.position.set(x, y, 0);

            return square;
        },
        getCurveParameters: function(x1, y1, x2, y2, curve){
            var radian = curve * Math.PI / 180,
                sn = (curve > 0 && curve < 180) || (curve <-180 && curve > -360)?1:-1,
                ql = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)), //distance between points 1 and 2
                rd = Math.abs((ql/2)/Math.sin(radian/2)),
                x3 = (x1+x2)/2, y3 = (y1+y2)/2, //the point halfway between points 1 and 2
                dx = (y1-y2)/ql, dy = (x2-x1)/ql, //direction of mirror line (normalized) that passing through (x, y) an between points 1 and 2
                ax = x3 + sn * Math.sqrt(rd*rd - (ql/2)*(ql/2))*dx, //X coordinate of arc center
                ay = y3 + sn * Math.sqrt(rd*rd - (ql/2)*(ql/2))*dy, //Y coordinate of arc center
                aStartAngle = Math.atan2(y1-ay, x1-ax),
                aEndAngle = Math.atan2(y2-ay, x2-ax),
                cw = curve < 0;
            return {
                'x': ax,
                'y': ay,
                'radius': rd,
                'startAngle': aStartAngle,
                'endAngle': aEndAngle,
                'clockWise': cw
            };
        },
        //V5.2D20170105 Added to support curved wires
        //V5.3D201701XX Updated to support any value of "curve", previous version supported only 90/-90
        //Check this page for math: http://mathforum.org/library/drmath/view/53027.html
        drawArc: function (x1, y1, x2, y2, curve, color){
            var segmentLength = parseFloat($('#com-chilipeppr-widget-eagle .curve-resolution').val());
            segmentLength = Math.min(segmentLength, 1.0);
            segmentLength = Math.max(segmentLength, 0.1);
            var radian = curve * Math.PI / 180,
                sn = (curve > 0 && curve < 180) || (curve <-180 && curve > -360)?1:-1,
                ql = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)), //distance between points 1 and 2
                rd = Math.abs((ql/2)/Math.sin(radian/2)),
                x3 = (x1+x2)/2, y3 = (y1+y2)/2, //the point halfway between points 1 and 2
                dx = (y1-y2)/ql, dy = (x2-x1)/ql, //direction of mirror line (normalized) that passing through (x, y) an between points 1 and 2
                ax = x3 + sn * Math.sqrt(rd*rd - (ql/2)*(ql/2))*dx, //X coordinate of arc center
                ay = y3 + sn * Math.sqrt(rd*rd - (ql/2)*(ql/2))*dy, //Y coordinate of arc center
                aStartAngle = Math.atan2(y1-ay, x1-ax),
                aEndAngle = Math.atan2(y2-ay, x2-ax),
                cw = curve < 0;
            var segments = Math.max(rd * Math.abs(radian)/segmentLength, 8); // Segment every [segmentLength] mm, minimum 8 segments
            var arcCurve = new THREE.EllipseCurve(
                ax, ay,
                rd, rd,
                aStartAngle, aEndAngle,
                cw
                );
            var points = arcCurve.getSpacedPoints( segments );
            
            var path = new THREE.Path();
            var geometry = path.createGeometry( points );
            
            var material = new THREE.LineBasicMaterial( { color : color } );
            
            var arc = new THREE.Line( geometry, material );
            return arc;
        },
        createCurvePoints: function (x1, y1, x2, y2, curve){
            var segmentLength = parseFloat($('#com-chilipeppr-widget-eagle .curve-resolution').val());
            segmentLength = Math.min(segmentLength, 1.0);
            segmentLength = Math.max(segmentLength, 0.1);
            var radian = curve * Math.PI / 180,
                sn = (curve > 0 && curve < 180) || (curve <-180 && curve > -360)?1:-1,
                ql = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)), //distance between points 1 and 2
                rd = Math.abs((ql/2)/Math.sin(radian/2)),
                x3 = (x1+x2)/2, y3 = (y1+y2)/2, //the point halfway between points 1 and 2
                dx = (y1-y2)/ql, dy = (x2-x1)/ql, //direction of mirror line (normalized) that passing through (x, y) an between points 1 and 2
                ax = x3 + sn * Math.sqrt(rd*rd - (ql/2)*(ql/2))*dx, //X coordinate of arc center
                ay = y3 + sn * Math.sqrt(rd*rd - (ql/2)*(ql/2))*dy, //Y coordinate of arc center
                aStartAngle = Math.atan2(y1-ay, x1-ax),
                aEndAngle = Math.atan2(y2-ay, x2-ax),
                cw = curve < 0;
            var segments = Math.max(rd * Math.abs(radian)/segmentLength, 8); // Segment every [segmentLength] mm, minimum 8 segments
            var arcCurve = new THREE.EllipseCurve(
                ax, ay,
                rd, rd,
                aStartAngle, aEndAngle,
                cw
                );
            var points = arcCurve.getSpacedPoints( segments );

            return points;
        },
        createArcPoints: function(aX, aY, radius, aStartAngle, aEndAngle){
            var segmentLength = parseFloat($('#com-chilipeppr-widget-eagle .curve-resolution').val());
            
            segmentLength = Math.min(segmentLength, 1.0);
            segmentLength = Math.max(segmentLength, 0.1);
            var segments = Math.max(radius * Math.PI/(2 * segmentLength), 8), // Segment every [segmentLength] mm, minimum 8 segments
                sa = aStartAngle * Math.PI / 180,
                ea = aEndAngle * Math.PI / 180,
                arcCurve = new THREE.EllipseCurve(
                    aX, aY,
                    radius, radius,
                    sa, ea
                ),
                points = arcCurve.getSpacedPoints( segments );
            return points;
        },
        drawSphere: function (x, y, radius, color){
            console.log("Sqhere position and color: ", x, y, color);
            var segments = 16;
            var material = new THREE.MeshBasicMaterial( { 
                     color: color,
                     wireframe : false,
                     transparent: true,
                     opacity: 0.5
                  } ),
                geometry = new THREE.SphereGeometry( radius, segments, segments, 0, Math.PI*2, 0, Math.PI/2); // HalfSphere
             
            var mesh = new THREE.Mesh( geometry, material ) ;
            mesh.position.set(x, y, 0);
            mesh.rotateX(Math.PI / 2); // 90 degrees
            return mesh;
        },
        drawSquare: function (x1, y1, x2, y2) {

            var square = new THREE.Geometry();

            //set 4 points
            square.vertices.push(new THREE.Vector3(x1, y2, 0));
            square.vertices.push(new THREE.Vector3(x1, y1, 0));
            square.vertices.push(new THREE.Vector3(x2, y1, 0));
            square.vertices.push(new THREE.Vector3(x2, y2, 0));

            //push 1 triangle
            square.faces.push(new THREE.Face3(0, 1, 2));

            //push another triangle
            square.faces.push(new THREE.Face3(0, 3, 2));

            //return the square object with BOTH faces
            return square;
        },
        mySceneGroup: null,
        sceneReAddMySceneGroup: function() {
            if (this.obj3d && this.mySceneGroup) {
                this.obj3d.add(this.mySceneGroup);
            }
            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneRemoveMySceneGroup: function() {
            if (this.obj3d && this.mySceneGroup) {
                this.obj3d.remove(this.mySceneGroup);
            }
            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneAdd: function (obj) {
            //chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneadd", obj);
            
            // this method of adding puts us in the object that contains rendered Gcode
            // that's one option, but when we send gcode to workspace we get overwritten
            // then
            //this.obj3d.add(obj);
            
            // let's add our Eagle BRD content outside the scope of the Gcode content
            // so that we have it stay while the Gcode 3D Viewer still functions
            if (this.mySceneGroup == null) {
                this.mySceneGroup = new THREE.Group();
                this.obj3d.add(this.mySceneGroup);
            }
            this.mySceneGroup.add(obj);
            //this.obj3dmeta.scene.add(obj);
            
            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneRemove: function (obj) {
            //chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneremove", obj);
            //this.obj3d.remove(obj);
            //this.obj3dmeta.scene.remove(obj);
            if (this.mySceneGroup != null)
                this.mySceneGroup.remove(obj);
            this.obj3dmeta.widget.wakeAnimate();
        },
        draw: function (e) {
            this.eagle.draw();
        },
        onDropped: function (data, info) {
            console.log("onDropped. len of file:", data.length, "info:", info);
            // we have the data
            // double check it's a board file, cuz it could be gcode
            if (data.match(/<!DOCTYPE eagle SYSTEM "eagle.dtd">/i)) {

                // check that there's a board tag
                if (data.match(/<board>/i)) {
                    console.log("we have an eagle board file!");
                    this.colorSignal = 9249571;
                    this.colorSmd = 9249571;
                    localStorage.setItem('com-chilipeppr-widget-eagle-lastDropped', data);
                    localStorage.setItem('com-chilipeppr-widget-eagle-lastDropped-info', JSON.stringify(info));
                    this.fileInfo = info;
                    console.log("saved brd file to localstorage");
                    this.open(data, info);
                } else {
                    console.log("looks like it is an eagle generated file, but not a board file. sad.");
                    chilipeppr.publish('/com-chilipeppr-elem-flashmsg/flashmsg', "Looks like you dragged in an Eagle CAD file, but it contains no board tag. You may have dragged in a schematic instead. Please retry with a valid board file.");
                }

                // now, we need to return false so no other widgets see this
                // drag/drop event because they won't know how to handle
                // an Eagle Brd file
                return false;
            } else {
                if (info.name.match(/.brd$/i)) {
                    // this looks like an Eagle brd file, but it's binary
                    chilipeppr.publish('/com-chilipeppr-elem-flashmsg/flashmsg', "Error Loading Eagle BRD File", "Looks like you dragged in an Eagle BRD file, but it seems to be in binary. You can open this file in Eagle and then re-save it to a new file to create a text version of your Eagle BRD file.", 15 * 1000);
                    return false;
                } else {
                    console.log("we do not have an eagle board file. sad.");
                }
            }
        },
        onDragOver: function () {
            console.log("onDragOver");
            $('#com-chilipeppr-widget-eagle').addClass("panel-primary");
        },
        onDragLeave: function () {
            console.log("onDragLeave");
            $('#com-chilipeppr-widget-eagle').removeClass("panel-primary");
        },
        isVidLoaded: false,
        lazyLoadTutorial: function () {
            // // lazy load tutorial tab youtube vid
            // //var isVidLoaded = false;
            // var that = this;
            // $('#' + this.id + ' a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            //     //e.target // activated tab
            //     console.log("tab activated. e.target:", $(e.target));
            //     if ($(e.target).text() == 'Tutorial') {
            //         // lazy load
            //         console.log("we are on tutorial tab");
            //         if (!that.isVidLoaded) {
            //             console.log("lazy loading vid cuz not loaded");
            //             that.isVidLoaded = true;
            //             $('#eagle-tutorial').html('<iframe style="width:100%;" class="" src="//www.youtube.com/embed/DX0xGgSARj4" frameborder="0" allowfullscreen></iframe>');
            //         }
            //     }
            //     //e.relatedTarget // previous tab
            // })

        },
        options: null,
        setupUiFromLocalStorage: function () {
            // read vals from cookies
            var options = localStorage.getItem('com-chilipeppr-widget-eagle-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            } else {
                options = {
                    showBody: true,
                    port: null,
                    z: 1.0
                };
            }

            this.options = options;
            console.log("options:", options);

            // show/hide body
            if (options.showBody) {
                this.showBody();
            } else {
                this.hideBody();
            }

        },
        saveOptionsLocalStorage: function () {
            //var options = {
            //    showBody: this.options.showBody
            //};
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store cookie
            localStorage.setItem('com-chilipeppr-widget-eagle-options', optionsStr);
        },
        showBody: function (evt) {
            $('#com-chilipeppr-widget-eagle .panel-body').removeClass('hidden');
            //$('#com-chilipeppr-widget-eagle .panel-footer').removeClass('hidden');
            $('#com-chilipeppr-widget-eagle .hidebody span').addClass('glyphicon-chevron-up');
            $('#com-chilipeppr-widget-eagle .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveOptionsLocalStorage();
            }
            $(window).trigger('resize');
        },
        hideBody: function (evt) {
            $('#com-chilipeppr-widget-eagle .panel-body').addClass('hidden');
            //$('#com-chilipeppr-widget-eagle .panel-footer').addClass('hidden');
            $('#com-chilipeppr-widget-eagle .hidebody span').removeClass('glyphicon-chevron-up');
            $('#com-chilipeppr-widget-eagle .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveOptionsLocalStorage();
            }
            $(window).trigger('resize');
        },
        btnSetup: function () {

            // chevron hide body
            var that = this;
            $('#com-chilipeppr-widget-eagle .hidebody').click(function (evt) {
                console.log("hide/unhide body");
                if ($('#com-chilipeppr-widget-eagle .panel-body').hasClass('hidden')) {
                    // it's hidden, unhide
                    that.showBody(evt);
                } else {
                    // hide
                    that.hideBody(evt);
                }
            });

            $('#com-chilipeppr-widget-eagle .btn-toolbar .btn').popover({
                delay: 500,
                animation: true,
                placement: "auto",
                trigger: "hover",
                container: 'body'
            });

            // refresh btn
            $('#com-chilipeppr-widget-eagle .btn-refresh').click(this.onFullRefresh.bind(this));
            
        },
        statusEl: null, // cache the status element in DOM
        status: function (txt) {
            console.log("status. txt:", txt);
            if (this.statusEl == null) this.statusEl = $('#com-chilipeppr-widget-eagle-status');
            var len = this.statusEl.val().length;
            if (len > 30000) {
                console.log("truncating status area text");
                this.statusEl.val(this.statusEl.val().substring(len - 5000));
            }
            this.statusEl.val(this.statusEl.val() + txt + "\n");
            this.statusEl.scrollTop(
            this.statusEl[0].scrollHeight - this.statusEl.height());
        },
        forkSetup: function () {
            var topCssSelector = '#com-chilipeppr-widget-eagle';

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 200,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load("http://raw.githubusercontent.com/chilipeppr/widget-pubsubviewer/master/auto-generated-widget.html", function () {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function (pubsubviewer) {
                    pubsubviewer.attachTo($('#com-chilipeppr-widget-eagle .panel-heading .dropdown-menu'), that);
                });
            });

        },
    }
});


var p = function (o) {
    console.log(o)
}
// -----------------------
// --- ENUMS, DEFAULTS ---
// -----------------------

EagleCanvas.LayerId = {
    'BOTTOM_COPPER': 1,
    'BOTTOM_SILKSCREEN': 2,
    'BOTTOM_DOCUMENTATION': 3,
    'DIM_BOARD': 4,
    'TOP_COPPER': 5,
    'TOP_SILKSCREEN': 6,
    'TOP_DOCUMENTATION': 7,
    'VIAS': 8,
    'OUTLINE': 9,
    'PADS': 10
}

EagleCanvas.LARGE_NUMBER = 99999;

// -------------------
// --- CONSTRUCTOR ---
// -------------------

function EagleCanvas(canvasId) {
    this.canvasId = canvasId;

    this.dimensionLayerUsed = false;
    this.millingLayerUsed = false;
    
    this.visibleLayers = {};
    this.visibleLayers[EagleCanvas.LayerId.BOTTOM_COPPER] = false;
    this.visibleLayers[EagleCanvas.LayerId.BOTTOM_SILKSCREEN] = false;
    this.visibleLayers[EagleCanvas.LayerId.BOTTOM_DOCUMENTATION] = false;
    this.visibleLayers[EagleCanvas.LayerId.DIM_BOARD] = true;
    this.visibleLayers[EagleCanvas.LayerId.TOP_COPPER] = true;
    this.visibleLayers[EagleCanvas.LayerId.TOP_SILKSCREEN] = true;
    this.visibleLayers[EagleCanvas.LayerId.TOP_DOCUMENTATION] = true;
    this.visibleLayers[EagleCanvas.LayerId.VIAS] = true;
    //this.visibleLayers[EagleCanvas.LayerId.PADS]                 = true;
    this.visibleLayers[EagleCanvas.LayerId.OUTLINE] = true;

    this.renderLayerOrder = [];
    this.renderLayerOrder.push(EagleCanvas.LayerId.BOTTOM_DOCUMENTATION);
    this.renderLayerOrder.push(EagleCanvas.LayerId.BOTTOM_SILKSCREEN);
    this.renderLayerOrder.push(EagleCanvas.LayerId.BOTTOM_COPPER);
    this.renderLayerOrder.push(EagleCanvas.LayerId.DIM_BOARD);
    this.renderLayerOrder.push(EagleCanvas.LayerId.OUTLINE);
    this.renderLayerOrder.push(EagleCanvas.LayerId.TOP_COPPER);
    this.renderLayerOrder.push(EagleCanvas.LayerId.VIAS);
    //this.renderLayerOrder.push(EagleCanvas.LayerId.PADS);
    this.renderLayerOrder.push(EagleCanvas.LayerId.TOP_SILKSCREEN);
    this.renderLayerOrder.push(EagleCanvas.LayerId.TOP_DOCUMENTATION);

    this.reverseRenderLayerOrder = [];
    this.reverseRenderLayerOrder.push(EagleCanvas.LayerId.TOP_DOCUMENTATION);
    this.reverseRenderLayerOrder.push(EagleCanvas.LayerId.TOP_SILKSCREEN);
    this.reverseRenderLayerOrder.push(EagleCanvas.LayerId.TOP_COPPER);
    this.reverseRenderLayerOrder.push(EagleCanvas.LayerId.DIM_BOARD);
    this.reverseRenderLayerOrder.push(EagleCanvas.LayerId.OUTLINE);
    this.reverseRenderLayerOrder.push(EagleCanvas.LayerId.BOTTOM_COPPER);
    //this.reverseRenderLayerOrder.push(EagleCanvas.LayerId.PADS);
    this.reverseRenderLayerOrder.push(EagleCanvas.LayerId.VIAS);
    this.reverseRenderLayerOrder.push(EagleCanvas.LayerId.BOTTOM_SILKSCREEN);
    this.reverseRenderLayerOrder.push(EagleCanvas.LayerId.BOTTOM_DOCUMENTATION);

    this.layerRenderFunctions = {};

    this.layerRenderFunctions[EagleCanvas.LayerId.BOTTOM_COPPER] = function (that, ctx) {
        that.drawSignalWires(that.eagleLayersByName['Bottom'], ctx);
        that.drawElements(that.eagleLayersByName['Bottom'], ctx);
    }

    this.layerRenderFunctions[EagleCanvas.LayerId.BOTTOM_SILKSCREEN] = function (that, ctx) {
        that.drawElements(that.eagleLayersByName['bNames'], ctx);
        that.drawElements(that.eagleLayersByName['bValues'], ctx);
        that.drawElements(that.eagleLayersByName['bPlace'], ctx);
    }

    this.layerRenderFunctions[EagleCanvas.LayerId.BOTTOM_DOCUMENTATION] = function (that, ctx) {
        that.drawElements(that.eagleLayersByName['bKeepout'], ctx);
        that.drawElements(that.eagleLayersByName['bDocu'], ctx);
    }

    this.layerRenderFunctions[EagleCanvas.LayerId.TOP_COPPER] = function (that, ctx) {
        that.drawSignalWires(that.eagleLayersByName['Top'], ctx);
        that.drawElements(that.eagleLayersByName['Top'], ctx);
    }

    this.layerRenderFunctions[EagleCanvas.LayerId.TOP_SILKSCREEN] = function (that, ctx) {
        that.drawElements(that.eagleLayersByName['tNames'], ctx);
        that.drawElements(that.eagleLayersByName['tValues'], ctx);
        that.drawElements(that.eagleLayersByName['tPlace'], ctx);
    }

    this.layerRenderFunctions[EagleCanvas.LayerId.TOP_DOCUMENTATION] = function (that, ctx) {
        that.drawElements(that.eagleLayersByName['tKeepout'], ctx);
        that.drawElements(that.eagleLayersByName['tDocu'], ctx);
    }

    this.layerRenderFunctions[EagleCanvas.LayerId.DIM_BOARD] = function (that, ctx) {
        that.dimCanvas(ctx, that.dimBoardAlpha);
    }

    this.layerRenderFunctions[EagleCanvas.LayerId.VIAS] = function (that, ctx) {
        that.drawSignalVias('1-16', ctx, '#0b0');
        //that.drawSignalVias('18-18',ctx, '#0b0');
    }

    this.layerRenderFunctions[EagleCanvas.LayerId.PADS] = function (that, ctx) {
        that.drawPads(ctx, '#0b0');
    }

    this.layerRenderFunctions[EagleCanvas.LayerId.OUTLINE] = function (that, ctx) {
        that.drawPlainWires(that.eagleLayersByName['Dimension'], ctx);
    }

    this.layerRenderFunctions[EagleCanvas.LayerId.BOTTOM_COPPER] = function (that, ctx) {
        that.drawSignalWires(that.eagleLayersByName['Bottom'], ctx);
        that.drawElements(that.eagleLayersByName['Bottom'], ctx);
    }


}

// ---------------
// --- LOADING ---
// ---------------

EagleCanvas.prototype.loadURL = function (url, cb) {
    this.url = url;
    var request = new XMLHttpRequest(),
        self = this;
    // rewrite www.chilipeppr.com url's to i2dcui.appspot.com so we support SSL
    this.url = this.url.replace(/http\:\/\/www.chilipeppr.com/, "//i2dcui.appspot.com");
    this.url = this.url.replace(/http\:\/\/chilipeppr.com/, "//i2dcui.appspot.com");
    this.url = this.url.replace(/\/\/www.chilipeppr.com/, "//i2dcui.appspot.com");
    this.url = this.url.replace(/\/\/chilipeppr.com/, "//i2dcui.appspot.com");

    request.open('GET', this.url, true);
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            self.loadText(request.responseText);
            cb(self)
        }
    };
    request.send(null);
};

EagleCanvas.prototype.loadText = function (text) {
    this.text = text;
    var parser = new DOMParser();
    this.boardXML = parser.parseFromString(this.text, "text/xml");
    this.parse();
    //this.nativeBounds = this.calculateBounds();
    //this.nativeSize = [this.nativeBounds[2] - this.nativeBounds[0], this.nativeBounds[3] - this.nativeBounds[1]];
    //this.scaleToFit();
}

// ---------------
// --- PARSING ---
// ---------------

EagleCanvas.prototype.parse = function () {
    console.group("Eagle Parse");
    // store by eagle name
    this.eagleLayersByName = {};
    // store by eagle number
    this.layersByNumber = {};

    this.restring = {
        pads:{top:{min:0, max:0, size:0},inner:{min:0, max:0, size:0},bottom:{min:0, max:0, size:0}, useDiameter:false},
        vias:{outer:{min:0, max:0, size:0},inner:{min:0, max:0, size:0}, useDiameter:false},
        microVias:{outer:{min:0, max:0, size:0},inner:{min:0, max:0, size:0}}
    }
    var param = this.boardXML.getElementsByTagName('param');
    for (var paramIdx = 0; paramIdx < param.length; paramIdx++){
        var p = param[paramIdx];
        var name = p.getAttribute("name");
        if(name == "useDiameter"){
            var n = parseInt(p.getAttribute("value"));
            this.restring.pads.useDiameter = ((n & 0x02) != 0);
            this.restring.vias.useDiameter = ((n & 0x10) != 0);
        }
        if(!name.startsWith("r")) continue;//we are only concenred about parameters start with rv or rl, nothing else starts with r
        var sVal = p.getAttribute("value");
        var v = sVal.includes("mil")?
            parseFloat(sVal.replace("mil", ""))*0.0254:
            sVal.includes("mm")?
                parseInt(sVal.replace("mm", "")):
                parseFloat(sVal);
                
        if(name == "rvPadTop") this.restring.pads.top.size = v;
        if(name == "rvPadInner") this.restring.pads.inner.size = v;
        if(name == "rvPadBottom") this.restring.pads.bottom.size = v;
        if(name == "rvViaOuter") this.restring.vias.outer.size = v;
        if(name == "rvViaInner") this.restring.vias.inner.size = v;
        if(name == "rvMicroViaOuter") this.restring.microVias.outer.size = v;
        if(name == "rvMicroViaInner") this.restring.microVias.inner.size = v;
        if(name == "rlMinPadTop") this.restring.pads.top.min = v;
        if(name == "rlMaxPadTop") this.restring.pads.top.max = v;
        if(name == "rlMinPadInner") this.restring.pads.inner.min = v;
        if(name == "rlMaxPadInner") this.restring.pads.inner.max = v;
        if(name == "rlMinPadBottom") this.restring.pads.bottom.min = v;
        if(name == "rlMaxPadBottom") this.restring.pads.bottom.max = v;
        if(name == "rlMinViaOuter") this.restring.vias.outer.min = v;
        if(name == "rlMaxViaOuter") this.restring.vias.outer.max = v;
        if(name == "rlMinViaInner") this.restring.vias.inner.min = v;
        if(name == "rlMaxViaInner") this.restring.vias.inner.max = v;
        if(name == "rlMinMicroViaOuter") this.restring.microVias.outer.min = v;
        if(name == "rlMaxMicroViaOuter") this.restring.microVias.outer.max = v;
        if(name == "rlMinMicroViaInner") this.restring.microVias.inner.min = v;
        if(name == "rlMaxMicroViaInner") this.restring.microVias.inner.max = v;
    }

    var layers = this.boardXML.getElementsByTagName('layer');
    for (var layerIdx = 0; layerIdx < layers.length; layerIdx++) {
        var layerDict = this.parseLayer(layers[layerIdx]);
        this.eagleLayersByName[layerDict.name] = layerDict;
        this.layersByNumber[layerDict.number] = layerDict;
    }

    this.elements = {};
    var elements = this.boardXML.getElementsByTagName('element');
    for (var elementIdx = 0; elementIdx < elements.length; elementIdx++) {
        var elemDict = this.parseElement(elements[elementIdx])
        this.elements[elemDict.name] = elemDict;
    }

    this.signalItems = {};
    //hashmap signal name -> hashmap layer number -> hashmap 'wires'->wires array, 'vias'->vias array
    var signals = this.boardXML.getElementsByTagName('signal');
    for (var sigIdx = 0; sigIdx < signals.length; sigIdx++) {
        var signal = signals[sigIdx];
        var name = signal.getAttribute('name');
        var signalLayers = {};
        this.signalItems[name] = signalLayers;

        var wires = signal.getElementsByTagName('wire');
        for (var wireIdx = 0; wireIdx < wires.length; wireIdx++) {
            var wireDict = this.parseWire(wires[wireIdx]);
            var layer = wireDict.layer;
            if (!(signalLayers[layer])) signalLayers[layer] = {};
            var layerItems = signalLayers[layer];
            if (!(layerItems['wires'])) layerItems['wires'] = [];
            var layerWires = layerItems['wires'];
            layerWires.push(wireDict);
        }

        var vias = signal.getElementsByTagName('via');
        for (var viaIdx = 0; viaIdx < vias.length; viaIdx++) {
            var viaDict = this.parseVia(vias[viaIdx]);
            var layers = viaDict.layers;
            if (!(signalLayers[layers])) signalLayers[layers] = {};
            var layerItems = signalLayers[layers];
            if (!(layerItems['vias'])) layerItems['vias'] = [];
            var layerVias = layerItems['vias'];
            layerVias.push(viaDict);
        }


        var contacts = signal.getElementsByTagName('contactref');
        for (var contactIdx = 0; contactIdx < contacts.length; contactIdx++) {
            var contact = contacts[contactIdx];
            var elemName = contact.getAttribute('element');
            var padName = contact.getAttribute('pad');
            var elem = this.elements[elemName];
            if (elem) {
                elem.padSignals[padName] = name;
                // check if @ sign in name cuz then
                // you have to create a redundant pad signal cuz this is one of
                // those special Eagle tricks that lets you connect multiple smd
                // pads to one signal
                if (padName.match(/@/)) {
                    padName.match(/(.+)@/);
                    var newPadName = RegExp.$1;
                    elem.padSignals[newPadName] = name;
                }
            }
        }
        
        // Get polygon pours
        var polygons = signal.getElementsByTagName('polygon');
        if (polygons.length > 0)
            console.log("polygons:", polygons);
        for (var polyIdx = 0; polyIdx < polygons.length; polyIdx++) {
            var polygon = polygons[polyIdx];
            var polyDict = this.parsePoly(polygon);
            
            // push this polygon to the layer array, and then the polygons group for
            // that layer
            var layer = polyDict.layer;
            if (!(signalLayers[layer])) signalLayers[layer] = {};
            var layerItems = signalLayers[layer];
            if (!(layerItems['polygons'])) layerItems['polygons'] = [];
            var layerPolys = layerItems['polygons'];
            layerPolys.push(polyDict);
        }
    }

    this.packagesByName = {};
    var packages = this.boardXML.getElementsByTagName('package');
    for (var packageIdx = 0; packageIdx < packages.length; packageIdx++) {
        var pkg = packages[packageIdx];
        var packageName = pkg.getAttribute('name');

        var packageSmds = [];
        var smds = pkg.getElementsByTagName('smd');
        for (var smdIdx = 0; smdIdx < smds.length; smdIdx++) {
            var smd = smds[smdIdx];
            packageSmds.push(this.parseSmd(smd));
        }

        var packagePads = [];
        var pads = pkg.getElementsByTagName('pad');
        for (var padIdx = 0; padIdx < pads.length; padIdx++) {
            var pad = pads[padIdx];
            packagePads.push(this.parsePad(pad));
        }
        
        var packagePolygons = [];
        var pPolygons = pkg.getElementsByTagName('polygon');
        for (var polygonIdx = 0; polygonIdx < pPolygons.length; polygonIdx++){
            var pPolygon = pPolygons[polygonIdx];
            packagePolygons.push(this.parsePoly(pPolygon));
        }
        // need to add rectangles as well

        var packageWires = [];
        var packageHoles = [];
        var bbox = [EagleCanvas.LARGE_NUMBER, EagleCanvas.LARGE_NUMBER, -EagleCanvas.LARGE_NUMBER, -EagleCanvas.LARGE_NUMBER];
        var wires = pkg.getElementsByTagName('wire');
        for (var wireIdx = 0; wireIdx < wires.length; wireIdx++) {
            var wire = wires[wireIdx];
            var wireDict = this.parseWire(wire);
            if (wireDict.x1 < bbox[0]) {
                bbox[0] = wireDict.x1;
            }
            if (wireDict.x1 > bbox[2]) {
                bbox[2] = wireDict.x1;
            }
            if (wireDict.y1 < bbox[1]) {
                bbox[1] = wireDict.y1;
            }
            if (wireDict.y1 > bbox[3]) {
                bbox[3] = wireDict.y1;
            }
            if (wireDict.x2 < bbox[0]) {
                bbox[0] = wireDict.x2;
            }
            if (wireDict.x2 > bbox[2]) {
                bbox[2] = wireDict.x2;
            }
            if (wireDict.y2 < bbox[1]) {
                bbox[1] = wireDict.y2;
            }
            if (wireDict.y2 > bbox[3]) {
                bbox[3] = wireDict.y2;
            }
            packageWires.push(wireDict);
        }
        if ((bbox[0] >= bbox[2]) || (bbox[1] >= bbox[3])) {
            bbox = null;
        }
        var packageTexts = [],
            texts = pkg.getElementsByTagName('text');
        for (var textIdx = 0; textIdx < texts.length; textIdx++) {
            var text = texts[textIdx];
            packageTexts.push(this.parseText(text));
        }
        //V5.2D20170105 Added
        var holes = pkg.getElementsByTagName('hole');
        for (var holeIdx = 0; holeIdx < holes.length; holeIdx++) {
            var holeDict = this.parseHole(holes[holeIdx]);
            packageHoles.push(holeDict);
        }
        var packageDict = {
            'pads': packagePads,
            'smds': packageSmds,
            'polygons': packagePolygons,
            'wires': packageWires,
            'holes': packageHoles, //V5.2D20170105 Added
            'texts': packageTexts,
            'bbox': bbox,
            'name' : packageName
        };
        this.packagesByName[packageName] = packageDict;
    }

    this.plainWires = {};
    this.plainDimensions = {};
    this.plainCircles = {};
    this.plainHoles = []; //V5.2D20170105 Added
    var plains = this.boardXML.getElementsByTagName('plain'); //Usually only one
    for (var plainIdx = 0; plainIdx < plains.length; plainIdx++) {
        var plain = plains[plainIdx],
            wires = plain.getElementsByTagName('wire');
        for (var wireIdx = 0; wireIdx < wires.length; wireIdx++) {
            var wire = wires[wireIdx],
                wireDict = this.parseWire(wire),
                layer = wireDict.layer;
            if (!this.plainWires[layer]) this.plainWires[layer] = [];
            this.plainWires[layer].push(wireDict);
        }
        //V5.2D20170105 Added
        var holes = plain.getElementsByTagName('hole');
        for (var holeIdx = 0; holeIdx < holes.length; holeIdx++) {
            var holeDict = this.parseHole(holes[holeIdx]);
            this.plainHoles.push(holeDict);
        }
        var circles = plain.getElementsByTagName('circle');
        for (var circleIdx = 0; circleIdx < circles.length; circleIdx++) {
            var circleDict = this.parseCircle(circles[circleIdx]),
                layer = circleDict.layer;
            if (!this.plainCircles[layer]) this.plainCircles[layer] = [];
            this.plainCircles[layer].push(circleDict);
        }
        var dimensions47 = plain.getElementsByTagName('dimension');
        for (var dimensionIdx = 0; dimensionIdx < dimensions47.length; dimensionIdx++) {
            var dimensionDict = this.parseDimension(dimensions47[dimensionIdx]),
                layer = dimensionDict.layer;
            if (!this.plainDimensions[layer]) this.plainDimensions[layer] = [];
            this.plainDimensions[layer].push(dimensionDict);
        }
    }

    console.log("Final objects after parse", this);
    console.groupEnd();
}

EagleCanvas.prototype.parseSmd = function (smd) {
    var smdX = parseFloat(smd.getAttribute('x')),
        smdY = parseFloat(smd.getAttribute('y')),
        smdDX = parseFloat(smd.getAttribute('dx')),
        smdDY = parseFloat(smd.getAttribute('dy'));

    return {
        'x1': smdX - 0.5 * smdDX,
        'y1': smdY - 0.5 * smdDY,
        'x2': smdX + 0.5 * smdDX,
        'y2': smdY + 0.5 * smdDY,
        'x': smdX,
        'y': smdY,
        'dx': smdDX,
        'dy': smdDY,
        'roundness': smd.getAttribute('roundness'),
        'rot': smd.getAttribute('rot'),
        'name': smd.getAttribute('name'),
        'layer': smd.getAttribute('layer')
    };
}

//V5.2D20170105 Added
EagleCanvas.prototype.parseHole = function (hole) {
    return {
        'x': parseFloat(hole.getAttribute('x')),
        'y': parseFloat(hole.getAttribute('y')),
        'drill': parseFloat(hole.getAttribute('drill'))
    };
}

EagleCanvas.prototype.parseCircle = function (circle) {
    var layer = parseInt(circle.getAttribute('layer'));
    this.millingLayerUsed = this.millingLayerUsed || (layer == 46);
    this.dimensionLayerUsed = this.dimensionLayerUsed || (layer == 20);
    return {
        'x': parseFloat(circle.getAttribute('x')),
        'y': parseFloat(circle.getAttribute('y')),
        'radius': parseFloat(circle.getAttribute('radius')),
        'width': parseFloat(circle.getAttribute('width')),
        'layer': layer
    };
}

EagleCanvas.prototype.parseDimension = function (dimension) {
    var layer = parseInt(dimension.getAttribute('layer'));
    return {
        'x1': parseFloat(dimension.getAttribute('x1')),
        'y1': parseFloat(dimension.getAttribute('y1')),
        'x2': parseFloat(dimension.getAttribute('x2')),
        'y2': parseFloat(dimension.getAttribute('y2')),
        'layer': layer
    };
}
//V5.1D20161227 this function is updated to calculate and return via diameter
/**Parse via attributes from .brd file
 * When via diameter is set to auto in Eagle, via is stored without diameter attribute
 * in this case we need to calculate diameter size the same way eagle does it and based on drill size
 * Vias with drill size smaller than 0.9mm get auto diameter of (drill size + 0.4064mm)
 * Vias with drill size larger than 2.1mm get auto diameter of (drill size + 1.016mm)
 * In between auto diameter is (drill x 1.5
 */
EagleCanvas.prototype.parseVia = function (via) {
    var v = this.restring.vias;
    var drill = parseFloat(via.getAttribute('drill'));
    var diameter = parseFloat(via.getAttribute('diameter'));
    var diameterInner = drill + 2 * Math.min(Math.max(drill*v.inner.size, v.inner.min), v.inner.max);
    var diameterOuter = drill + 2 * Math.min(Math.max(drill*v.outer.size, v.outer.min), v.outer.max);
    if(diameter){
        var size = diameter - drill; //width of copper ring predifined by user
        if(size > v.outer.size) diameterOuter = diameter;
        if(size > v.inner.size && v.useDiameter) diameterInner = diameter;

    }
    return {
        'x': parseFloat(via.getAttribute('x')),
        'y': parseFloat(via.getAttribute('y')),
        'drill': parseFloat(via.getAttribute('drill')),
        'diameter': diameter,
        'diameterInner': diameterInner,
        'diameterOuter': diameterOuter,
        'layers': via.getAttribute('extent'),
        'shape': via.getAttribute('shape')
    };
}

EagleCanvas.prototype.parsePad = function (pad) {
    // put pads in Top and Bottom layer artificially
    var p = this.restring.pads;
    var drill = parseFloat(pad.getAttribute('drill'));
    var diameter = parseFloat(pad.getAttribute('diameter'));
    var diameterTop = drill + 2 * Math.min(Math.max(drill*p.top.size, p.top.min), p.top.max);
    var diameterInner = drill + 2 * Math.min(Math.max(drill*p.inner.size, p.inner.min), p.inner.max);
    var diameterBottom = drill + 2 * Math.min(Math.max(drill*p.bottom.size, p.bottom.min), p.bottom.max);
    if(diameter){
        var size = diameter - drill; //width of copper ring predifined by user
        if(size > p.top.size) diameterTop = diameter;
        if(size > p.inner.size && p.useDiameter) diameterInner = diameter;
        if(size > p.bottom.size) diameterBottom = diameter;
    }
    return {
        'x': parseFloat(pad.getAttribute('x')),
        'y': parseFloat(pad.getAttribute('y')),
        'drill': parseFloat(pad.getAttribute('drill')),
        'diameter': diameter,
        'diameterTop': diameterTop,
        'diameterInner': diameterInner,
        'diameterBottom': diameterBottom,
        'shape': pad.getAttribute('shape'),
        'rot': pad.getAttribute('rot'),
        'name': pad.getAttribute('name')
    };
}

EagleCanvas.prototype.parseWire = function (wire) {
    var width = parseFloat(wire.getAttribute('width'));
    //if (width <= 0.0) width = this.minLineWidth;
    var curve = parseFloat(wire.getAttribute('curve'));  //V5.2D20170105 Added
    var layer = parseInt(wire.getAttribute('layer'));
    if(!curve) curve = 0;                        //V5.2D20170105 Added
    this.millingLayerUsed = this.millingLayerUsed || (layer == 46);
    this.dimensionLayerUsed = this.dimensionLayerUsed || (layer == 20);
    return {
        'x1': parseFloat(wire.getAttribute('x1')),
            'y1': parseFloat(wire.getAttribute('y1')),
            'x2': parseFloat(wire.getAttribute('x2')),
            'y2': parseFloat(wire.getAttribute('y2')),
            'width': width,
            'layer': layer,
            'curve': curve  //V5.2D20170105 Added
    };
}

EagleCanvas.prototype.parsePoly = function (poly) {
    var width = parseFloat(poly.getAttribute('width'));
    if (width <= 0.0) width = this.minLineWidth;
    // Polygons look like this
    /*
    <polygon width="0.254" layer="16" rank="2">
    <vertex x="0" y="0"/>
    <vertex x="71.12" y="0"/>
    <vertex x="71.12" y="54.61"/>
    <vertex x="0" y="54.61"/>
    </polygon>
    */
    var vertices = [];
    var vertexElems = poly.getElementsByTagName('vertex');
    for (var vertIdx = 0; vertIdx < vertexElems.length; vertIdx++) {
        var vertexElem = vertexElems[vertIdx];
        var curve = parseFloat(vertexElem.getAttribute('curve'));
        if(!curve) curve = 0;
        var vertex = {
            x: parseFloat(vertexElem.getAttribute('x')),
            y: parseFloat(vertexElem.getAttribute('y')),
            curve: curve
        };
        vertices.push(vertex);
    }
    
    return {
        'width': width,
        'layer': parseInt(poly.getAttribute('layer')),
        'rank': parseInt(poly.getAttribute('rank')),
        'thermals': poly.getAttribute('thermals'),
        'pour': poly.getAttribute('pour'),
        'vertices': vertices
    };
}

EagleCanvas.prototype.parseText = function (text) {
    var content = text.textContent;
    if (!content) content = "";
    return {
        'x': parseFloat(text.getAttribute('x')),
            'y': parseFloat(text.getAttribute('y')),
            'size': parseFloat(text.getAttribute('size')),
            'layer': parseInt(text.getAttribute('layer')),
            'font': text.getAttribute('font'),
            'content': content
    };
}

EagleCanvas.prototype.parseElement = function (elem) {
    var elemRot = elem.getAttribute('rot') || "R0",
        elemMatrix = this.matrixForRot(elemRot);

    var attribs = {},
    elemAttribs = elem.getElementsByTagName('attribute');
    for (var attribIdx = 0; attribIdx < elemAttribs.length; attribIdx++) {

        var elemAttrib = elemAttribs[attribIdx],
            attribDict = {},
            name = elemAttrib.getAttribute('name');

        if (name) {
            attribDict.name = name;
            if (elemAttrib.getAttribute('x')) {
                attribDict.x = parseFloat(elemAttrib.getAttribute('x'));
            }
            if (elemAttrib.getAttribute('y')) {
                attribDict.y = parseFloat(elemAttrib.getAttribute('y'));
            }
            if (elemAttrib.getAttribute('size')) {
                attribDict.size = parseFloat(elemAttrib.getAttribute('size'));
            }
            if (elemAttrib.getAttribute('layer')) {
                attribDict.layer = parseInt(elemAttrib.getAttribute('layer'));
            }
            attribDict.font = elemAttrib.getAttribute('font');

            var rot = elemAttrib.getAttribute('rot');
            if (!rot) {
                rot = "R0";
            }
            attribDict.rot = rot;
            attribs[name] = attribDict;
        }
    }

    // since elements can reference packages, lets just get a copy of
    // the package data as well and stick it in this element
    var pkgName = elem.getAttribute('package');
    if (pkgName) {
        console.log("this element references a pkg. elem:", elem, "pkgName:", pkgName);
        var pkg = null;
    }

    return {
        'pkg': elem.getAttribute('package'),
            'name': elem.getAttribute('name'),
            'value': elem.getAttribute('value'),
            'x': parseFloat(elem.getAttribute('x')),
            'y': parseFloat(elem.getAttribute('y')),
            'rot': elemRot,
            'matrix': elemMatrix,
            'mirror': elemRot.indexOf('M') == 0,
            'smashed': elem.getAttribute('smashed') && (elem.getAttribute('smashed').toUpperCase() == 'YES'),
            'attributes': attribs,
            'padSignals': {} //to be filled later
    };
};

EagleCanvas.prototype.parseLayer = function (layer) {
    return {
        'name': layer.getAttribute('name'),
            'number': parseInt(layer.getAttribute('number')),
            'color': parseInt(layer.getAttribute('color'))
    };
}

// --------------------
// --- COMMON UTILS ---
// --------------------

EagleCanvas.prototype.colorPalette = [
    [0, 0, 0],
    [35, 35, 141],
    [35, 141, 35],
    [35, 141, 141],
    [141, 35, 35],
    [141, 35, 141],
    [141, 141, 35],
    [141, 141, 141],
    [39, 39, 39],
    [0, 0, 180],
    [0, 180, 0],
    [0, 180, 180],
    [180, 0, 0],
    [180, 0, 180],
    [180, 180, 0],
    [180, 180, 180]
];

EagleCanvas.prototype.layerColor = function (colorIdx) {
    var rgb = this.colorPalette[colorIdx];
    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
}

EagleCanvas.prototype.matrixForRot = function (rot) {
    var flipped = (rot.indexOf('M') == 0),
        degreeString = rot.substring(flipped ? 2 : 1),
        degrees = parseFloat(degreeString),
        rad = degrees * Math.PI / 180.0,
        flipSign = flipped ? -1 : 1,
        matrix = [flipSign * Math.cos(rad), flipSign * -Math.sin(rad), Math.sin(rad), Math.cos(rad)];
    return matrix;
}

EagleCanvas.prototype.mirrorLayer = function (layerIdx) {
    if (layerIdx == 1) {
        return 16;
    } else if (layerIdx == 16) {
        return 1;
    }
    var name = this.layersByNumber[layerIdx].name,
        prefix = name.substring(0, 1);
    if (prefix == 't') {
        var mirrorName = 'b' + name.substring(1),
            mirrorLayer = this.eagleLayersByName[mirrorName];
        if (mirrorLayer) {
            return mirrorLayer.number;
        }
    } else if (prefix == 'b') {
        var mirrorName = 't' + name.substring(1),
            mirrorLayer = this.eagleLayersByName[mirrorName];
        if (mirrorLayer) {
            return mirrorLayer.number;
        }
    }
    return layerIdx;
}
