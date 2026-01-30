#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;

precision highp float;
uniform highp float pos_x;
uniform highp float pos_y;
uniform highp float ang;
uniform highp float pixelWidth;
uniform highp float pixelHeight;
uniform highp float horizon;
uniform highp float fov;
uniform highp float scale_x;
uniform highp float scale_y;
uniform highp float single_image;


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * sin( time / 30.0 ) * 10.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + sin( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 15.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 9.75 ), 3.0 );

}