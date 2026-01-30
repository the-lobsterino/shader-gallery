precision mediump float;uniform vec2 resolution;uniform vec2 mouse;//Robert Schütze (trirop) 05.12.2015
void main(){vec3 p = vec3((gl_FragCoord.xy-resolution/2.0)/(resolution.y),mouse.x);
	for (int i = 0; i < 100; i++){p = abs((abs(p)/dot(p,p)-1.0));
	    if(length(p)>1.0&&length(p)<1.01)break;}
	gl_FragColor.rgb = p;gl_FragColor.a = 1.0;}