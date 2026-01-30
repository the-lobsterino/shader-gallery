#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float pi = 3.14159265359;

float rand(int seed, float ray) 
{
	return mod(sin(float(seed)*363.5346+ray*674.2454)*6743.4365, 1.0);
}

//--------------------------------------------------------
// draw circle lamp
//--------------------------------------------------------
vec3 lampcirc (vec2 pt, vec2 pos, float power, float fallof, vec3 color)
{
	pt = pt - pos;
	float d = length(pt);
	//vec3 col = vec3(0.5, 0.5, 0.9) * (pow(dist, -0.8) * 0.11);
	vec3 col = color * (pow(d, power * -1.0) * fallof) - (d/3.0 * fallof);
	return col;
}

//---------------------------------------------------------
// draw rectangle lamp
//---------------------------------------------------------
vec3 lamprect (vec2 pt, vec2 pos, vec2 size, float power, float fallof, vec3 color)
{
  	float d = length(max(abs(pt - pos), size) - size);
	return color * (pow(d, power * -1.0) * fallof) - (d/3.0 * fallof);   
}


void main( void )
{
	vec2 npos = gl_FragCoord.xy / resolution.xy;   // 0.0 .. 1.0
	float aspect = resolution.x / resolution.y;    // aspect ratio x/y
 	vec2 ratio = vec2(aspect, 1.0);                // aspect ratio (x/y,1)
 	vec2 uv = (2.0 * npos - 1.0) * ratio;          // -1.0 .. 1.0
 	vec2 pt = uv;
	
	vec2 pos = vec2(0,0);
  	vec2 size = vec2(0.1, 0.01);
  	float power = .6;
	float fallof = 0.2;
	
	vec3 col1; 
	vec3 col2;
	
	//--- rounded rectangle ---
  	const vec3 light_color = vec3(0.5, 0.4, 0.8);
  	col1 = lamprect(pt, pos, vec2(0.2, 0.01), power, fallof, light_color);
	col2 = lamprect(pt, pos, vec2(0.01, 0.2), power, fallof, light_color);

	
	
	gl_FragColor = vec4((col1+col2)/1.2, 1.0);
}





