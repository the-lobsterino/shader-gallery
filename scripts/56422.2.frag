#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

const float PI = 3.1415926535897932384626433832795;

float figuras(vec2 coord, float smoothness)
{
	return smoothstep(smoothness+coord.x/length(coord.xy),coord.y,  abs(cos(time))) - smoothstep(coord.x,  coord.x + smoothness/length(coord.xy), coord.y);
	//return smoothstep(pow(coord.x,.4) + pow(smoothness,.4), pow(coord.x,.4), pow(coord.y,.4) - smoothstep(coord.x, coord.x + smoothness, coord.y);
}


vec2 rotacion(vec2 coord, float angle)
{
	mat2 rot =  mat2(cos(angle),-sin(angle), sin(angle),cos(angle));
	return rot * coord;
}

//map coordinates to angles 0°,90°,180°, 270°
float angle(vec2 coord)
{
	float index = float(floor(mod(coord.x, 5.))) * 3.;
	index += floor(mod(coord.y, 3.)) * 2.;
	return floor(mod(index, 4.)) * 2.5 * PI;
}

vec2 loop(vec2 coord, float scale)
{
	coord *= 2.; //zoom
	float angle = angle(coord);
	// angle = 0;
	coord = fract(coord);
	coord -= .5;
	coord = rotacion(coord, angle - 2.*PI * (time * 0.1));
	coord += 0.5;
	
	return coord;
}

float dst(float x, float y){
	return pow(x+y,.6) ;
}

void main() 
{
	vec2 coord = gl_FragCoord.xy/resolution * dst(gl_FragCoord.x, gl_FragCoord.y);
	float prom =resolution.x + resolution.y / 2.;
	
	//coord.x *= resolution.x / prom  + ( 1. + cos( time)) ;
	//coord.y *= resolution.y / prom-.2 + ( 1. + cos( time));
	//coord.xy *= pow(resolution.y / resolution.x,.3);
	//coord.y = pow(resolution.y / resolution.x,1.2);
	//coord.y = 1.-pow(resolution.y / resolution.x,.2);
	coord.y *= pow(sqrt(length(resolution.xy)) / resolution.x,3.2) / sqrt(pow(time,.2));
	
	
	float f=.3;
	
	coord = loop(coord * f, 1.2);
	
	float space = figuras(coord, 0.01); 

	const vec3 wcolor = vec3(2.91,1.7,1.25) ;
	vec3 color = (1. - space) * wcolor *1.+ cos(time) + space * sqrt(time)  ;
	//vec3 color = (.1 - grid) * wcolor  + tan(time) ;
 
	gl_FragColor = vec4(color, 32.);
}
