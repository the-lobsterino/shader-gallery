#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float t = time * 0.10;

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	//vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / (min(resolution.x, resolution.y));
	float color = 0.0;
        for (float i = 0.0; i < 10.0; i+=1.0){
		color += 0.01 / abs((2.8 + cos(mouse.x + mouse.y) - 0.5) - length(p - cos(t * i * 2.0) * sin(t * i) ) );
        }

	gl_FragColor = vec4(sin(color * t), cos(color * t), sin(color / t), 1.0);

}