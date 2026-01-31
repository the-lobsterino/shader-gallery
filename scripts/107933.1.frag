#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Basic Parameters
#define NSEGMENTS 100     	// Numbers of emitters to divide into segment
#define ENERGY_TOTAL 0.01   	// for nomalizing the gradient of the display

#define USE_YMAG 1		// energy for each point is only the y component
#define WIDTH_TOTAL_PCT 0.8	// percentage width of the display to use for full length bar
#define ROT_FREQ_HZ		0.0

// Derivied Parameters
#define PORTION (ENERGY_TOTAL/float(NSEGMENTS)) // initial energy contribution of each emitter

const float PI = 3.14;

mat2 rotationMatrix(float angle)
{
	angle *= PI / 180.0;
	float s=sin(angle), c=cos(angle);
	return mat2( c, -s, 
     		     s,  c );
}

vec2 rotatedUnitVec(float angle)
{
	return vec2(1.0,0.0)*rotationMatrix(angle);    
}

void main(void) {
	// normalize st for resolution of box, between 0.0-1.0
	vec2 st = gl_FragCoord.xy/resolution.xy;
    	float bar_total_length = ((sin(1.14*time)+(1.0))/2.0)*WIDTH_TOTAL_PCT;

    	float seg_width = bar_total_length / float(NSEGMENTS);
   	float init_seg_offset = (seg_width/2.0);
    
    	float angle = ROT_FREQ_HZ*time*360.0;
    	vec2 direction_vector  = rotatedUnitVec(angle);
   	vec2 start_pos = vec2(0.5,0.5)-(direction_vector*(bar_total_length/2.0));
    

    	float mag = 0.0;
	// total magnitude is the summed contribution of each emmitter
    	for (int seg = 0; seg < NSEGMENTS; ++seg)
   	{
		vec2 emitter_pos = start_pos + (direction_vector * (init_seg_offset + seg_width*float(seg)));
        	vec2 r = st - emitter_pos;
        	float dist_squared = dot(r,r);
        	if (dist_squared > 0.0)
       		{
            		vec2 e = (normalize(r) / dist_squared) * PORTION;
#if USE_YMAG
            		mag = mag + abs(e.y);
#else
            		mag = mag + abs(length(e));
#endif
		}
	}
	
	// here we split up the total magnitude value into component colors
	// to make the dynamic range more visible
    	float mag_upscaled = mag * 3.0;
   	float most_sig_comp = clamp(mag_upscaled, 2.0, 3.0) - 2.0;
    	float mid_sig_comp = clamp(mag_upscaled, 1.0, 2.0) - 1.0;
    	float least_sig_comp = clamp(mag_upscaled, 0.0, 1.0);
    	vec3 color = vec3(least_sig_comp, mid_sig_comp, most_sig_comp);

    gl_FragColor = vec4(color,1.000);
}