#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float noise2d(vec2 p) {
	return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 456367.5453);
}

vec4 sample(int x, int y)
{
	vec2 p = ( (gl_FragCoord.xy + vec2(x, y)) / resolution.xy );
	float building = 0.0;
	float color=0.0;
	for (int i = 1; i < 20; i++) {
		float fi = float(i)*(1.+(1.*mouse.y));
		
		float s = floor(250.*p.x/fi+15.*fi*(mouse.x)+time);
		if (p.y-fi/(222.*mouse.y) < noise2d(vec2(s,1./s)) - fi*(0.05*(0.5+mouse.y))+0.01*sin(time*0.5)) {
			building = fi/(21.);
			color=fi/abs((21.0-20.*sin(time*0.5)));
			color=(clamp(length(p.xy*.15) * .35, 0.0, 1.0), 0.0, 0.0) + smoothstep(0.15, .0, length((gl_FragCoord.xy/(1.05*resolution.xy))-.9)) * 1.9;
		}
	}
	return vec4(vec3(building,building,building*color),building);
}

#define EDGE_THRESHOLD .001

bool edge()
{
	return  distance(sample(0, 0), sample(1, 1)) > EDGE_THRESHOLD;
}

void main( void )
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	float stars = fract(7153.1 * sin(pow(p.x/p.y, 2.)));
	if (stars < 0.99+sin(time)*0.005) stars = .1;
	vec3 moon = vec3(clamp(length(p.xy*.15) * .35, 0.0, 1.0), 0.0, 0.0) + smoothstep(0.15, 1.211, length((gl_FragCoord.xy/(1.05*resolution.xy))-.9)) * 1.9;
	vec3 sky = moon + vec3(1.9, .86, .8) * p.x * p.y * sin(time * 0.25) + (1.0 - sin(time * 0.25)) * stars;
	
	vec4 building=sample(0,0);
	if(building.y>0.0){
		sky=vec3(0,0,0);
	if(edge()){
		building=vec4(0.0);
	}
	}
	
	gl_FragColor = vec4(sky+vec3(building), 1.0);
}