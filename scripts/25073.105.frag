// by @eddietree
// study of Reaction-Diffusion model: http://www.karlsims.com/rd.html
//https://pmneila.github.io/jsexp/grayscott/

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592654



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
	

float random(vec2 v) 
{
	return fract(sin(dot(v ,vec2(12.9898,78.233))) * (100.0+time*0.05));
}

vec4 laplacian( vec4 curr_val, vec2 uv_center, vec2 delta_uv )
{
	float weights[9];
	
	/*weights[0] = -1.0;
	weights[1] = 0.2;
	weights[2] = 0.05;
	weights[3] = 0.2;
	weights[4] = 0.05;
	weights[5] = 0.2;
	weights[6] = 0.05;
	weights[7] = 0.2;
	weights[8] = 0.05;*/
	
	weights[0] = -4.0;
	weights[1] = 1.0;
	weights[2] = 0.0;
	weights[3] = 1.0;
	weights[4] = 0.0;
	weights[5] = 1.0;
	weights[6] = 0.0;
	weights[7] = 1.0;
	weights[8] = 0.0;
	
	vec2 uv_offsets[9];
	uv_offsets[0] = vec2(0.0);
	uv_offsets[1] = vec2(1.0,0.0);
	uv_offsets[2] = vec2(1.0);
	uv_offsets[3] = vec2(0.0,1.0);
	uv_offsets[4] = vec2(-1.0,1.0);
	uv_offsets[5] = vec2(-1.0,0.0);
	uv_offsets[6] = vec2(-1.0);
	uv_offsets[7] = vec2(0.0,-1.0);
	uv_offsets[8] = vec2(1.0,-1.0);
	
	vec4 result = vec4(0.0);
	for(int i = 0; i < 9; i+=1 )
	{
		vec2 uv = uv_center + uv_offsets[i] * delta_uv;
		vec4 tex_val = texture2D( backbuffer, uv );
		result += tex_val * weights[i];
	}
	
	return result;
}

void main( void ) {
	
	vec2 vUv = gl_FragCoord.xy / resolution.xy;
	
	if ( time < 0.5 )
	{
		//gl_FragColor = vec4( vec3(random(uv)),1.0);
		
		//vec2 uv_norm = uv * 2.0 - vec2(1.0);
		//float step_val = step(length(uv_norm),0.05);
		//float step_val = step( random(uv*0.01), 0.5);
		//gl_FragColor = vec4( step_val, 1.0-step_val, 0.0, 1.0);
		//gl_FragColor = vec4( 1.0-step_val, step_val, 0.0, 1.0);
		gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0);
	}
	else
	{
		float delta = 0.8;
		float feed = 0.037;
		float kill = 0.06;
		
		vec2 delta_uv = vec2(1.0) / resolution;
		float step_x = delta_uv.x;
		float step_y = delta_uv.y;
		
		vec2 uv = texture2D(backbuffer, vUv).rg;
                vec2 uv0 = texture2D(backbuffer, vUv+vec2(-step_x, 0.0)).rg;
                vec2 uv1 = texture2D(backbuffer, vUv+vec2(step_x, 0.0)).rg;
                vec2 uv2 = texture2D(backbuffer, vUv+vec2(0.0, -step_y)).rg;
                vec2 uv3 = texture2D(backbuffer, vUv+vec2(0.0, step_y)).rg;
		
                
                vec2 lapl = (uv0 + uv1 + uv2 + uv3 - 4.0*uv);//10485.76;
                float du = 0.2097*lapl.r - uv.r*uv.g*uv.g + feed*(1.0 - uv.r);
                float dv = 0.105*lapl.g + uv.r*uv.g*uv.g - (feed+kill)*uv.g;
                vec2 dst = uv + delta*vec2(du, dv);
		
		
		vec2 mouse_pos_rel = mouse;// / resolution;
		if ( length(  (mouse_pos_rel - vUv)*resolution.x / resolution.y ) < 0.01 )
		{
			//curr_A = 0.0;
			dst.g = 0.9;
		}
		
		//gl_FragColor = vec4( mouse, 0.0, 1.0 );
		gl_FragColor = vec4(dst.r,dst.g, 0.0, 1.0 );
		
	}
}