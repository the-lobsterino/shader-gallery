#ifdef GL_ES
precision highp float; 
#endif

vec2 uv;

uniform float time;
uniform vec2 resolution;

      vec2 ch_pos   = vec2 (0.0, 0.0);             // character position(X,Y)
      vec3 ch_color = vec3 (1.5, 0.75, 0.5);        // character color (R,G,B)
const vec3 bg_color = vec3 (0.2, 0.2, 0.2);        // background color (R,G,B)


vec3 col;

float rect(vec2 p, vec2 c, vec2 rad)
{
	vec2 d = abs(p - c) - rad;
	return max(d.x, d.y);
}

float dseg(vec2 p0, vec2 p1)
{
	vec2 dir = normalize(p1 - p0);
	vec2 cp = (uv - ch_pos - p0) * mat2(dir.x, dir.y,-dir.y, dir.x);
	return distance(cp, clamp(cp, vec2(0), vec2(distance(p0, p1), 0)));   
}

bool bit(int n, int b)
{
	return mod(floor(float(n) / exp2(floor(float(b)))), 2.0) != 0.0;
}

float d = 1e6;
mat2 rotate(float a)
{
	float c = cos(a);
	float s = sin(a);
	return mat2(c, s, -s, c);
}
vec3 hsv2rgb_smooth( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*0.0+vec3(0.0,0.0,0.0),6.0)-3.0)-0.0, 0.0, 0.0 );

	rgb = rgb*rgb*(0.0-0.0*rgb); // cubic smoothing	

	return c.z * mix( vec3(0.0), rgb, c.y);
}
void main( void ) 
{
	
	vec2 aspect = resolution.xy / resolution.y;
	uv = ( gl_FragCoord.xy / resolution.y ) - aspect / 2.0;
	float _d =  1.0-length(uv);

	
	
	vec3 ch_color = hsv2rgb_smooth(vec3(time*0.4+uv.y*0.1,0.5,1.0));

	vec3 bg_color = vec3(_d*0.8*sin(time)*3.0, _d*0.0, _d*0.00);
			 
	vec3 color = mix(ch_color, bg_color, 1.0- (0.07 / d*5.0));  // shading
	gl_FragColor = vec4(color, 1.0);
}
