// N140920N one of my new favorit functions! :)

precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse; // Robert Schütze (trirop) 07.12.2015 
varying vec2 surfacePosition;

#define MAX 10.
void main(){
  	vec3 p = vec3(surfacePosition,0.0);
	
	float t = dot(p,p);
	for (float i = 0.; i < MAX; i++){
    		p.xzy = abs(p/dot(p,p) - vec3(1.0, 1., abs(sin(t*0.1))));
	}
  	
	gl_FragColor.rgb = p;
	gl_FragColor.rgb /= MAX;

	gl_FragColor.a = 1.0;
}