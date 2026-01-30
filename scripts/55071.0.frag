#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// simple wave by David Clews
// http://davidclews.com
// 

uniform float time;
uniform vec2 click;
uniform vec2 resolution;


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;

	vec3 wave_color = vec3(0.0);

	float wave_width = 3.0;
	uv  = -3.0 + 3.0 * uv;
	uv.y += 0.0;
	for(float i = 4.0; i <= 5.0; i++) {
		uv.y += (2.0+(0.4*sin(time*4.0) * sin(uv.x + i/7.0 + 2.0 *time )));
                uv.x += 1.7* sin(time*0.4);
		
		wave_width = abs(50.0 / (100.0 * uv.y));
		wave_color += vec3(wave_width *( 0.4+((i+1.0)/18.0)), wave_width * (i / 100000.0), wave_width * ((i+10.0)/ 900000.0) * 7.9);
	}

	fragColor = vec4(wave_color, 10.);
}

void main(void) {
 
  mainImage(gl_FragColor, gl_FragCoord.xy);
}