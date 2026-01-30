precision mediump float;

        uniform float     time;
        uniform vec2      resolution;
        uniform vec2      mouse;

        #define MAX_ITER 3

        void main( void )
        {
            if(mouse.x <10.0)
            gl_FragColor = vec4(1.0,1.0,0.0,1.0);
		if(mouse.y <10.0  && mouse.y> 50.0)
            gl_FragColor = vec4(0.0,1.0,0.0,1.0);
        }