#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// influence threshold
const float threshold = 0.98;


struct Metaball
{
	vec3 colour;
	vec2 position;
	float radius;
};

void main( void ) {
	Metaball metaballs[4];
	// add metaballs (colour, position, radius)
	metaballs[0] = Metaball(vec3(0,1,1), vec2(100.0,90.0), 40.0);
	metaballs[1] = Metaball(vec3(1,0.5,0), vec2(120.0,200.0), 50.0);
	metaballs[2] = Metaball(vec3(0,0,0), vec2(200.0,90.0), 60.0);
	metaballs[3] = Metaball(vec3(0.5,0,1), vec2(0,0), 70.0);
	// animate(rotate) some of the metaballs
	metaballs[0].position.x = resolution.x*sin(time)/2.0  + resolution.x/2.0;
	metaballs[0].position.y = resolution.y*cos(time)/2.0  + resolution.y/2.0;	
	metaballs[1].position.x = resolution.x*sin(time)/2.0  + resolution.x/2.0;
	metaballs[3].position = (mouse * time);
	
	
	vec3 col = vec3(0,0,0); // colour = sum(metaball.colour * influence)
	float infl = 0.0;	// total influence
	for(int i = 0; i < 4; i++)
	{
		Metaball mb = metaballs[i];
		float dist = length(gl_FragCoord.xy - mb.position);
		float currInfl = mb.radius * mb.radius;
		currInfl /= (pow(gl_FragCoord.x-mb.position.x,2.0) + pow(gl_FragCoord.y-mb.position.y,2.0));
		infl += currInfl;
		col += mb.colour*currInfl;
	}
	// normalise, if influence > threshold
	if(infl > threshold)
		col = normalize(col);
	// show outer line
	if(infl > threshold && infl < threshold + .03)
		col = col * 3.0;
		
	gl_FragColor = vec4(col, 1.0);

}