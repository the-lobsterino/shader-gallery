#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.01*cos(time+time)),
                         _radius+(_radius*0.01-cos(time)),
                         dot(dist,dist)*4.0);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 st = gl_FragCoord.xy/resolution.xy;

	vec3 color;
	color *= sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color *= color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color.z -= sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color.x *= sin( time / 10.0 ) * 0.5;
	color /= vec3( circle(st,0.9));

	gl_FragColor = vec4( color, 1.0 );


}