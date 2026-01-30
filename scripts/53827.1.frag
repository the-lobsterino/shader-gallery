#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 d = ( gl_FragCoord.xy / resolution.xy );

                d.x = d.x-0.5;
                d.y = d.y-0.5;

                float amp = sqrt(d.x*d.x + d.y *d.y);
                float rad = atan(d.y,d.x);

                if(amp>0.3) amp = 0.3;

                d.x = amp * cos(rad) + 0.5; 
                d.y = amp * sin(rad) + 0.5;
	
	
	gl_FragColor = vec4( d.x,d.y,0, 1.0 );

}