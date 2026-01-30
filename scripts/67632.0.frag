// N140920N one of my new favorit functions! :)

precision mediump float;
uniform vec2 resolution;
uniform vec2 mouse; // Robert Schütze (trirop) 07.12.2015 
void main(){
	vec3 p = vec3((gl_FragCoord.xy)/(resolution.y),mouse.x);
  
	for (int i = 0; i < 15; i++){
    		p.xzy = abs(dot(p,p)/p - vec3(1.0, 1., mouse.y));
	}
  gl_FragColor.rgb = p;gl_FragColor.a = 1.0;}