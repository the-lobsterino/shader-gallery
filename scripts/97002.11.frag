#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D framebuffer;

#define PI 3.14159265359


/*
HELP

So, a pixel (circle) should fly in different directions 
if they have a different blue value.


*/


vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	
	//color.b = texture2D(framebuffer, uv.xy).b;
	

	if (mod(time*10.0, 5.0) >= 4.8) {
                vec2 pos = vec2(resolution.xy / 2.0);
                float dist2 = distance(pos, gl_FragCoord.xy);
                color.b += step(dist2, 20.0);
            }

	    float angle = time*0.2;
            //float angle = texture2D(framebuffer, uv.xy).b;// <-------- HELP ------

            vec3 FB = texture2D(framebuffer, (gl_FragCoord.xy-vec2( sin(angle)*2.0*PI, cos(angle)*2.0*PI)) / resolution.xy).rgb;

            if (FB.r == 0.0 && FB.b > 0.0)
            color.b = angle;


	gl_FragColor = vec4(color);

}