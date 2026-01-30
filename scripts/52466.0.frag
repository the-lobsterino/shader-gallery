#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float pi = atan(5.0)*4.0;
float tau = atan(1.0)*8.0;

float scale = 1.0 / 20.0;

float epsilon = 1e-3;
float infinity = 1e6;

//Settings
//Uses cheaper arcs for common sweep angles (90 & 180 degrees).
#define USE_CHEAP_ARCS

#define BORDER_COLOR vec3(0.05, 0.20, 1.00)

#define BRIGHTNESS 0.004
#define THICKNESS  0.001

//Checks if a and b are approximately equal.
bool ApproxEqual(float a, float b)
{
    return abs(a - b) <= epsilon;
}

//Distance to a line segment,
float dfLine(vec2 start, vec2 end, vec2 uv)
{
	start *= scale;
	end *= scale;
    
	vec2 line = end - start;
	float frac = dot(uv - start,line) / dot(line,line);
	return distance(start + line * clamp(frac, 0.0, 1.0), uv);
}

//Distance to an arc.
float dfArc(vec2 origin, float start, float sweep, float radius, vec2 uv)
{
	origin *= scale;
	radius *= scale;  
	uv -= origin;
    
	uv *= mat2(cos(start), sin(start),-sin(start), cos(start));
	
    #ifdef USE_CHEAP_ARCS
        if(ApproxEqual(sweep, pi)) //180 degrees
        {
            float d = abs(length(uv) - radius) + step(uv.y, 0.0) * infinity;
            d = min(d, min(length(uv - vec2(radius, 0)), length(uv + vec2(radius, 0))));
            return d;
        }
        else if(ApproxEqual(sweep, pi/2.0)) //90 degrees
        {
            float d = abs(length(uv) - radius) + step(min(uv.x, uv.y), 0.0) * infinity;
            d = min(d, min(length(uv - vec2(0, radius)), length(uv - vec2(radius, 0))));
            return d;
        }
        else //Others
        {
            float offs = (sweep / 2.0 - pi);
            float ang = mod(atan(uv.y, uv.x) - offs, tau) + offs;
            ang = clamp(ang, min(0.0, sweep), max(0.0, sweep));

            return distance(radius * vec2(cos(ang), sin(ang)), uv); 
        }
    #else
        float offs = (sweep / 2.0 - pi);
        float ang = mod(atan(uv.y, uv.x) - offs, tau) + offs;
        ang = clamp(ang, min(0.0, sweep), max(0.0, sweep));

        return distance(radius * vec2(cos(ang), sin(ang)), uv);
	#endif
}

float dfBorder(vec2 uv)
{
    float dist = infinity;
    
	dist = min(dist, dfLine(vec2(0.067,1.533), vec2(8.733,1.533), uv));   // TOP
	dist = min(dist, dfLine(vec2(-0.333,0.067), vec2(-0.333,1.133), uv)); // LEFT
	dist = min(dist, dfLine(vec2(9.133,1.133), vec2(9.133,0.067), uv));   // RIGHT
	dist = min(dist, dfLine(vec2(8.733,-0.333), vec2(0.067,-0.333), uv)); // BOTTOM
	
	dist = min(dist, dfArc(vec2(0.067,1.133),1.571, 1.571, 0.400, uv));   // TOP LEFT
	dist = min(dist, dfArc(vec2(8.733,1.133),0.000, 1.571, 0.400, uv));   // TOP RIGHT
	dist = min(dist, dfArc(vec2(0.067,0.067),3.142, 1.571, 0.400, uv));   // BOTTOM LEFT
	dist = min(dist, dfArc(vec2(8.733,0.067),4.712, 1.571, 0.400, uv));   // BOTTOM RIGHT
    
    return dist;
}

void main( void )
{
	vec2 aspect = resolution.xy / resolution.y;
	vec2 uv = gl_FragCoord.xy / resolution.y - aspect;
	
    vec2 offs = vec2(10.5, 3.5) * scale;
    
    float dist = 0.0;
    float shade = 0.0;
    vec3 color = vec3(0);
    
    //Flicker fade in effect.
    float tf_text = max(epsilon, time - 0.6);
    float bright_text = BRIGHTNESS * min(1.0, 1.0 - sin(tf_text * pi * 50.0) / (tf_text * pi * 1.3));
    
    float tf_bord = max(epsilon, time - 0.5);
    float bright_bord = BRIGHTNESS * min(1.0, 1.0 - sin(tf_bord * pi * 50.0) / (tf_bord * pi * 1.3));
    
    //Border
    dist = dfBorder(uv + offs);
	
	shade = bright_bord / max(epsilon, dist - THICKNESS);
	
	color += BORDER_COLOR * shade;
	
	gl_FragColor = vec4(color , 1.0);	
	
	
	
	//gl_FragColor = vec4(0.0);
}