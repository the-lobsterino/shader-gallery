#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

vec3 bpt_xy2rgb3( vec2 pos ) {
    vec2 rowcol = pos * 8.0;
    vec2 modpos = fract( rowcol );
    rowcol = (rowcol - modpos) * 0.125;
    return vec3( (rowcol.y * 0.125) + rowcol.x, modpos );
}

void main( void ) {
	gl_FragColor = vec4( bpt_xy2rgb3( gl_FragCoord.xy / resolution.xy ), 1.0 );
}
