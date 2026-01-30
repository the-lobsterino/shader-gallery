#ifdef GL_ES
precision mediump float;
#endif

// so now we've got a oscilloscope, eh.
//and now we've got quasi-uniform thickness & 2-phase synchronous motor drive on the bench

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 position;

vec3 plot(vec2 p){
	float t = p.x+time/mouse.x;
	float m = mouse.y*2.;
	float sx = sin(t) * m;
	float dsx = cos(t) * m;
	float dist = abs(sx-p.y)/sqrt(dsx*dsx+1.0);
	float dist2 = abs(dsx-p.y)/sqrt(-sx*-sx+1.0);
	return vec3(0.02/dist, 0.02/dist2, 0.0);
}

void main( void ) {

	position = ( gl_FragCoord.xy / resolution.xy );
	position.y = position.y * resolution.y/resolution.x + 0.2;
	position.x = (position.x - 0.5) * 100.0;
	position.y = (position.y - 0.5) * 100.0;
	
	vec3 color = vec3(0.0);
	float ratio = resolution.x / resolution.y;
	
	if(abs(position.x) < 0.2) color += vec3(0.4);
	if(abs(position.y) < 0.2 / ratio) color += vec3(0.4);
	
	color += plot(position*.0625);
	
	
	gl_FragColor = vec4(color, 1.0 );

}