#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 mouse;
uniform vec2 resolution;
#define g gl_FragColor
void main( void ) {
vec2 position = ( gl_FragCoord.xy / resolution.xy );
vec2 d,d2;float c,c2 = 0.;
d = position.xy - mouse.xy;d2 = position.xy - vec2(0.655674,0.565656566);
c+=.01/(sqrt(d.x*d.x+d.y*d.y));
c2+=.01/(sqrt(d2.x*d2.x+d2.y*d2.y));
g = vec4( vec3(0.5*c), 1.0 );g+= vec4( vec3(0.5*c2), 1.0 );
}