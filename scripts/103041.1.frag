#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 curvature = vec2(2.0);

vec2 curveRemapUV(vec2 uv) {
	uv = uv * 2.0 - 1.0;
	vec2 offset = abs(uv.yx) / curvature;
	uv = uv + uv * offset * offset;
	uv = uv * 0.5 + 0.5;
	
	return uv;
}


void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution.xy;

	vec2 ruv = curveRemapUV(uv);
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	vec4 baseColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

	if (ruv.x < 0.1 || ruv.y < 0.0 || ruv.x > 1.0 || ruv.y > 1.0){
        	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    	} else {
        	gl_FragColor = baseColor;
    	}

}