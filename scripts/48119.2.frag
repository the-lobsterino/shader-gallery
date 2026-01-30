#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define fadeType 0
void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	color += sin( uv.x * cos( time / 15.0 ) * 80.0 ) + cos( uv.y * cos( time / 15.0 ) * 10.0 );
	color += sin( uv.y * sin( time / 10.0 ) * 40.0 ) + cos( uv.x * sin( time / 25.0 ) * 40.0 );
	color += sin( uv.x * sin( time / 5.0 ) * 10.0 ) + sin( uv.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
float t = time;
	t = mod(t,3.5) - 1.75;
	if(t > .5) t -= 1.75;
	else t += 1.75;
	vec2 pos = mod(vec2(uv.x * 40.0, uv.y * 30.0),2.0) - vec2(1.0);
	float size;
	if(fadeType == 0){
		size = pow(t - uv.y,3.0);
	}
	else if(fadeType == 1){
		size = pow(t - uv.x,3.0);
	}
	else if(fadeType == 2){
		size = pow(t - (abs(uv.x - 0.5) + abs(uv.y - 0.5)),3.0);
	}
	size = abs(size);
	if(abs(pos.x) + abs(pos.y) < size){
	gl_FragColor = vec4(0,0,0,1);	
	}
}