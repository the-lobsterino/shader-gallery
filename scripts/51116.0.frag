#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = atan(9.0)*4.0;
float tau = atan(1.0)*8.0;

float scale = 1.0 / 6.0;

float epsilon = 1e-3;
float infinity = 1e6;



//Settings
//Uses cheaper arcs for common sweep angles (90 & 180 degrees).
#define USE_CHEAP_ARCS

#define TEXT_COLOR   vec3(1.00, 0.20, 0.10)
#define BORDER_COLOR vec3(0.05, 0.20, 1.00)

#define BRIGHTNESS 0.014
#define THICKNESS  0.003
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

float dfLogo(vec2 uv)
{
	float dist = infinity;
	float t1 = 5.0;
	float h = -1.5;
	float o = 3.0;
	float t2= 0.7;
	float s = -6.8;

	//T
	//dist = min(dist, dfArc(vec2(6.400,0.067),3.142, 3.142, 0.067, uv));
	//dist = min(dist, dfLine(vec2(6.000,1.200), vec2(6.333,1.200), uv));
	//dist = min(dist, dfLine(vec2(6.467,0.067), vec2(6.467,1.200), uv));
	//dist = min(dist, dfLine(vec2(6.333,0.067), vec2(6.333,1.200), uv));
	//dist = min(dist, dfLine(vec2(6.467,1.200), vec2(6.800,1.200), uv));

	dist = min(dist, dfArc(vec2(6.400 -t1,0.067),3.142, 3.142, 0.067, uv));
	dist = min(dist, dfLine(vec2(6.000 -t1,1.200), vec2(6.333-t1,1.200), uv));
	dist = min(dist, dfLine(vec2(6.467 -t1,0.067), vec2(6.467-t1,1.200), uv));
	dist = min(dist, dfLine(vec2(6.333 -t1,0.067), vec2(6.333-t1,1.200), uv));
	dist = min(dist, dfLine(vec2(6.467 -t1,1.200), vec2(6.800-t1,1.200), uv));
	
	//H
	dist = min(dist, dfLine(vec2(1.000-h,1.800), vec2(1.000-h,0.067), uv));
	dist = min(dist, dfLine(vec2(1.133-h,0.067), vec2(1.133-h,0.533), uv));
	dist = min(dist, dfLine(vec2(1.200-h,0.600), vec2(1.667-h,0.600), uv));
	dist = min(dist, dfLine(vec2(1.733-h,0.667), vec2(1.733-h,1.133), uv));
	dist = min(dist, dfLine(vec2(1.867-h,1.133), vec2(1.867-h,0.000), uv));
	dist = min(dist, dfArc(vec2(1.800-h,1.133),0.000, 3.142, 0.067, uv));
	dist = min(dist, dfArc(vec2(1.067-h,0.067),3.142, 3.142, 0.067, uv));
	
	//O
	dist = min(dist, dfArc(vec2(7.467-o,0.867),0.000, 3.142, 0.333, uv));
	dist = min(dist, dfArc(vec2(7.467-o,0.333),4.712, 1.571, 0.333, uv));
	dist = min(dist, dfArc(vec2(7.333-o,0.333),3.142, 1.571, 0.333, uv));
	dist = min(dist, dfLine(vec2(7.000-o,1.000), vec2(7.000-o,0.333), uv));	
	dist = min(dist, dfLine(vec2(7.800-o,1.000), vec2(7.800-o,0.333), uv));

	//t
	dist = min(dist, dfArc(vec2(6.400-t2,0.067),3.142, 3.142, 0.067, uv));
	dist = min(dist, dfLine(vec2(6.000-t2,1.200), vec2(6.333-t2,1.200), uv));
	dist = min(dist, dfLine(vec2(6.467-t2,0.067), vec2(6.467-t2,1.200), uv));
	dist = min(dist, dfLine(vec2(6.333-t2,0.067), vec2(6.333-t2,1.200), uv));
	dist = min(dist, dfLine(vec2(6.467-t2,1.200), vec2(6.800-t2,1.200), uv));
	
	
	//S
	dist = min(dist, dfArc(vec2(0.267-s,0.933),1.571, 3.142, 0.267, uv));
	dist = min(dist, dfArc(vec2(0.067-s,0.067),1.571, 3.142, 0.067, uv));
	dist = min(dist, dfArc(vec2(0.533-s,0.333),4.712, 3.142, 0.333, uv));
	dist = min(dist, dfLine(vec2(0.267-s,1.200), vec2(0.533-s,1.200), uv));
	dist = min(dist, dfLine(vec2(0.267-s,0.667), vec2(0.533-s,0.667), uv));
	dist = min(dist, dfLine(vec2(0.533-s,0.000), vec2(0.067-s,0.000), uv));
	dist = min(dist, dfLine(vec2(0.400-s,0.133), vec2(0.067-s,0.133), uv));
	
	
	


	return dist;
}

float dfBorder(vec2 uv)
{
    float dist = infinity;
    
	dist = min(dist, dfLine(vec2(0.067,1.533), vec2(8.733,1.533), uv));
	dist = min(dist, dfLine(vec2(9.133,1.133), vec2(9.133,0.067), uv));
	dist = min(dist, dfLine(vec2(8.733,-0.333), vec2(4.467,-0.333), uv));
	dist = min(dist, dfLine(vec2(-0.333,0.067), vec2(-0.333,1.133), uv));
	dist = min(dist, dfLine(vec2(0.067,1.400), vec2(4.333,1.400), uv));
	dist = min(dist, dfLine(vec2(9.000,1.133), vec2(9.000,0.067), uv));
	dist = min(dist, dfLine(vec2(8.733,-0.200), vec2(0.067,-0.200), uv));
	dist = min(dist, dfLine(vec2(-0.200,0.067), vec2(-0.200,1.133), uv));
	dist = min(dist, dfLine(vec2(4.333,-0.333), vec2(0.067,-0.333), uv));
	dist = min(dist, dfLine(vec2(4.467,1.400), vec2(8.733,1.400), uv));
	dist = min(dist, dfArc(vec2(8.733,1.133),0.000, 1.571, 0.400, uv));
	dist = min(dist, dfArc(vec2(8.733,0.067),4.712, 1.571, 0.400, uv));
	dist = min(dist, dfArc(vec2(0.067,0.067),3.142, 1.571, 0.400, uv));
	dist = min(dist, dfArc(vec2(0.067,1.133),1.571, 1.571, 0.400, uv));
	dist = min(dist, dfArc(vec2(8.733,1.133),0.000, 1.571, 0.267, uv));
	dist = min(dist, dfArc(vec2(8.733,0.067),4.712, 1.571, 0.267, uv));
	dist = min(dist, dfArc(vec2(0.067,0.067),3.142, 1.571, 0.267, uv));
	dist = min(dist, dfArc(vec2(0.067,1.133),1.571, 1.571, 0.267, uv));
    
    return dist;
}

// signed distance to rect
float rect(vec2 p, vec2 center, vec2 radius){
    vec2 d = abs(p - center) - radius;
    return max(d.x, d.y);
}

// subtract two distance fields
float sub(float a_dist, float b_dist){
    return max(a_dist, -b_dist);
}

// rotate vector counterclockwise around origin
vec2 rotate(vec2 v, float angle){
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c)*v;
}
void main( void ) {
	
	
	vec2 p = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;
    float aspect_ratio = resolution.x/resolution.y;
    p.x *= aspect_ratio;
    p *= 2.0;
    
    // apply ripple effect
    float ripple = sin(p.x*5.0 + p.y*1.0 - time*2.0)*0.03;
    p = p*(ripple + 1.0);
    
    // rotate swastika because why not
    vec2 q = rotate(p, 1.);
    
    // make a box in the middle
    float swastika_distance = rect(q, vec2(0.0), vec2(0.7));
    // and subtract 4 parts from it
    swastika_distance = sub(swastika_distance, rect(q, vec2(-0.3, 0.4), vec2(0.2, 0.3)));
    swastika_distance = sub(swastika_distance, rect(q, vec2(+0.3, 0.4), vec2(0.2, 0.3)));
    swastika_distance = sub(swastika_distance, rect(q, vec2(-0.4, 0.3), vec2(0.3, 0.2)));
    swastika_distance = sub(swastika_distance, rect(q, vec2(+0.4, +0.3), vec2(0.3, 0.2)));

    // float width = fwidth(length(p)); // fwidth not enabled
    float width = abs(2.0*aspect_ratio/resolution.x) + abs(2.0/resolution.y);
	
    // black swastika on white background
    vec4 color = vec4(smoothstep(-width, 0.0, swastika_distance));
    
    // mix in flag color
    vec4 flag_color = vec4(0.666, 0.0, 0.0, 0.3);
    float distance_to_center = length(p);
    float red_flag = smoothstep(-width, 0.0, distance_to_center - 1.0);
    color = mix(color, flag_color, red_flag);
    
    // mix in background color
    vec4 background_color = vec4(0.0);
    float flag_distance = rect(p, vec2(0.0), vec2(aspect_ratio, 1.0)*1.5);
    float background = smoothstep(-width, 0.0, flag_distance);
    color = mix(color, background_color, background);
    
    // fake flag lighting
    color *= ripple*12.0 + 1.0;
	
	
	vec2 aspect = resolution.xy / resolution.y;
	vec2 uv = gl_FragCoord.xy / resolution.y - aspect/2.0;
	
    vec2 offs = vec2(9.0, 1.5) * scale/2.0;
    
    float dist = 0.0;
    float shade = 0.0;
    //vec3 color = vec3(0);
    
    //Flicker fade in effect.
    float tf_text = max(epsilon, time - 0.6);
    float bright_text = BRIGHTNESS * min(1.0, 1.0 - sin(tf_text * pi * 50.0) / (tf_text * pi * 1.3));
    
    float tf_bord = max(epsilon, time - 0.5);
    float bright_bord = BRIGHTNESS * min(1.0, 1.0 - sin(tf_bord * pi * 50.0) / (tf_bord * pi * 1.3));
    
    //text
	dist = dfLogo(uv + offs+vec2(0.0, 0.3)) ;
	shade = bright_text / max(epsilon, dist - THICKNESS);
	color += vec4(TEXT_COLOR, 1.0) * shade;
    
    //Border
    	dist = dfBorder(uv + offs+vec2(0.0, 0.3));
	shade = bright_bord / max(epsilon, dist - THICKNESS);
	color += vec4(BORDER_COLOR,1.0) * shade;
	

	//vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	
	//float dy = 0.5/ ( 50. * abs(p.y + sin(p.x*10.0+time)*pow(sin(time), 2.0)*0.2));
	
	//color +=  vec3( (p.x + 0.5) * dy, 0.5 * dy, dy-1.65);
	
	gl_FragColor = color;



	



}