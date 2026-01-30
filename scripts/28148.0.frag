precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 checkerBoard( vec2 uv, vec2 pp ) {
    float t = mod( uv.x + uv.y, 1.0);
    vec3 c = vec3(t+pp.x, t+pp.y, t+(pp.x*sin(pp.y)));
    return c;
}
vec3 tunnel( vec2 p, float scrollSpeed, float rotateSpeed ) {    
    float a = 2.0 * atan( p.x, p.y  );
    float px = pow( p.x*p.x, 2. );
    float py = pow( p.y*p.y, 2. );
    float r = pow( px + py, 1.0/8. );    
    vec2 uvp = vec2( 1.0/r + time, a);	
    vec3 finalColor = checkerBoard( uvp, p );
    return finalColor;
}
void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 p = uv + vec2( -0.5, -0.5);
    vec3 finalColor = tunnel( p , 0555.0, 0.0);
    gl_FragColor = vec4( finalColor, 1.0 );
}