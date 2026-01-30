#ifdef GL_ES
precision mediump float;
#endif
 
uniform vec2 resolution;
 
void main( void ) {
    //vec2 p = ( gl_FragCoord.xy / resolution.xy );
    //float v = distance(p, vec2(0.5,0.5));
    //gl_FragColor = vec4(0.0,0.0, v,1.0);
	vec2 uv = gl_FragCoord.xy / resolution.xy;//-.5;
	gl_FragColor = vec4(uv, 0.0,1.0);
	//uv.x*=resolution.x/resolution.y;
}