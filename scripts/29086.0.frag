#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

vec3 bpt_xy2rgb3dot( vec2 pos, float v ) {
   vec2 modpos = fract( pos /= v );
   return vec3( dot( pos -= modpos, vec2( v*v, v )), modpos );
}

void main( void ) {
	gl_FragColor = vec4( bpt_xy2rgb3dot( gl_FragCoord.xy / resolution.xy, 1.0/8.0 ), 1.0 );
}
