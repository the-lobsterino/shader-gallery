// Flyguy from ST ;
// gtr 
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//Constants
#define TAU 6.2831853071795865

//Parameters
#define TUNNEL_LAYERS 64
#define RING_POINTS 64
#define POINT_SIZE 4.8
#define POINT_COLOR_A vec3(1.0)
#define POINT_COLOR_B vec3(0.5)
#define SPEED 0.4

float iTime=time;
vec2 iResolution=resolution;
 

//Square of x
float sq(float x)
{
	return x*x;   
}

//Angular repeat
vec2 AngRep(vec2 uv, float angle)
{
    vec2 polar = vec2(atan(uv.y, uv.x), length(uv));
    polar.x = mod(polar.x + angle / 2.0, angle) - angle / 2.0; 

    return polar.y * vec2(cos(polar.x), sin(polar.x));
}

//Signed distance to circle
float sdCircle(vec2 uv, float r)
{
    return length(uv) - r;
}

//Mix a shape defined by a distance field 'sd' with a 'target' color using the 'fill' color.
vec3 MixShape(float sd, vec3 fill, vec3 target)
{
    float blend = smoothstep(0.0,1.0/iResolution.y, sd);
    return mix(fill, target, blend);
}

//Tunnel/Camera path
vec2 TunnelPath(float x)
{
    vec2 offs = vec2(0, 0);
    
    offs.x = 0.2 * sin(TAU * x * 0.5) + 0.4 * sin(TAU * x * 0.2 + 0.3);
    offs.y = 0.3 * cos(TAU * x * 0.3) + 0.2 * cos(TAU * x * 0.1);
    
    offs *= smoothstep(1.0,4.0, x);
    
    return offs;
}

void main()
{
    vec2 res = iResolution.xy / iResolution.y;
	vec2 uv = gl_FragCoord.xy / iResolution.y;
    
    uv -= res/2.0;
    
    vec3 color = vec3(0);
    
    float repAngle = TAU / float(RING_POINTS);
    float pointSize = POINT_SIZE/2.0/iResolution.y;
    
    float camZ = iTime * SPEED;
    vec2 camOffs = TunnelPath(camZ);
    
    for(int i = 1;i <= TUNNEL_LAYERS;i++)
    {
        float pz = 1.0 - (float(i) / float(TUNNEL_LAYERS));
        
        //Scroll the points towards the screen
        pz -= mod(camZ, 4.0 / float(TUNNEL_LAYERS));
        
        //Layer x/y offset
        vec2 offs = TunnelPath(camZ + pz) - camOffs;
        
        //Radius of the current ring
        float ringRad = 0.15 * (1.0 / sq(pz * 0.8 + 0.4));
        
        //Only draw points when uv is close to the ring.
        if(abs(length(uv + offs) - ringRad) < pointSize * 1.5) 
        {
            //Angular repeated uv coords
            vec2 aruv = AngRep(uv + offs, repAngle);

            //Distance to the nearest point
            float pdist = sdCircle(aruv - vec2(ringRad, 0), pointSize);

            //Stripes
            vec3 ptColor = (mod(float(i / 2), 2.0) == 0.0) ? POINT_COLOR_A : POINT_COLOR_B;
            
            //Distance fade
            float shade = (1.0-pz);

            color = MixShape(pdist, ptColor * shade, color);
        }
    }
    
	
	
	float c= sin(time*50.0);
	
	if (length(gl_FragCoord.xy - mouse * resolution) < resolution.y/20.) 
	
	gl_FragColor = vec4(c);

	else
		
	gl_FragColor = vec4(vec3(color.r,color.g,color.b*6.), 1.0);	

}
