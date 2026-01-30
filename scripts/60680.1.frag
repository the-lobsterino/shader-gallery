#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

const float fov = 3.1415 / 4.0;
const float EP = 0.05;
const float box_r = 1.5;
const mat4 mT = mat4(	2.0,0.0,
                     	2.0,1.0,
                     	2.0,2.0,
                     	2.0,3.0,
                    	0.0,3.0,
                     	1.0,3.0,
                    	3.0,3.0,
                     	4.0,3.0);

const mat4 mG = mat4(	0.0,1.0,
                     	0.0,2.0,
                     	1.0,0.0,
                     	1.0,3.0,
                    	2.0,0.0,
                     	2.0,3.0,
                    	3.0,0.0,
                     	3.0,1.0);

const mat4 mC = mat4(	0.0,1.0,
                     	0.0,2.0,
                     	1.0,0.0,
                     	1.0,3.0,
                    	2.0,0.0,
                     	2.0,3.0,
                    	3.0,0.0,
                     	3.0,3.0);
    
    
    
float rand(vec3 x)
{
	float n = dot(x , vec3(1.0,113.0,257.0) );
    return fract(sin(n)*43758.5453) - 0.5;
}

bool ray_aabb(vec3 org,vec3 dir,vec3 lb, vec3 rt,out float dist)
{
    bool rta = false;
    vec3 dirfrac = 1.0 / dir;
    vec3 A = (lb-org)*dirfrac;
    vec3 B = (rt-org)*dirfrac;
    float tmin = max(max(min(A.x, B.x), min(A.y, B.y)), min(A.z, B.z));
    float tmax = min(min(max(A.x, B.x), max(A.y, B.y)), max(A.z, B.z));
    if (tmin<=tmax && tmin>0.0)
    {
        rta = true;
        dist = tmin;
    }
	return rta;
}


bool ray_edge(vec3 org,vec3 dir,vec3 lb, vec3 rt)
{
    bool rta = false;
    vec3 dirfrac = 1.0 / dir;
    vec3 A = (lb-org)*dirfrac;
    vec3 B = (rt-org)*dirfrac;
    float tmin = max(max(min(A.x, B.x), min(A.y, B.y)), min(A.z, B.z));
    float tmax = min(min(max(A.x, B.x), max(A.y, B.y)), max(A.z, B.z));
    if (tmin<=tmax && tmin>0.0)
    {
        int cant = 0;
		vec3 Ip = org + dir*tmin;
        vec3 Ta = abs(Ip - lb);
        vec3 Tb = abs(Ip - rt);
        if( Ta.x < EP)
            cant++;
        if( Ta.y < EP)
            cant++;
        if( Ta.z < EP)
            cant++;
        
        if( Tb.x < EP)
            cant++;
        if( Tb.y < EP)
            cant++;
        if( Tb.z < EP)
            cant++;
        
        rta = cant>=2 ? true : false;
    }
	return rta;
}

void main()
{
    
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float x = 2.0*uv.x-1.0;
    float y = 2.0*uv.y-1.0;
	float time = time*2.0;
    vec3 vLookFrom = vec3(20.0*sin(time),0.0*cos(time),20.0*cos(time));
    vec3 vLookAt = vec3(0.0,0.0,0.0);
    vec3 N = normalize(vLookAt-vLookFrom);
    vec3 V = normalize(cross( N , vec3(0.0,1.0,0.0)));
    vec3 U = cross(V , N);
    float k = 2.0*tan(fov/2.0);
	vec3 Dy = U*(k*resolution.y/resolution.x*0.8);
	vec3 Dx = V*k;
    
	// direccion de cada rayo
	vec3 D = normalize(N + Dx*x + Dy*y);
    vec3 box_dim = vec3(box_r,box_r,box_r);
    
    gl_FragColor = vec4(0.0,0.0,0.0,1.0);

    float min_dist = 1000000.0;
    for(float s=0.0;s<3.0;++s)
    for(int i=0;i<4;++i)
    for(int j=0;j<2;++j)
    {
        float rnd = rand(vec3(uv,time))*0.02;
		float dist;
        vec3 box_or;
        if(s==0.0)
        	box_or = vec3(mT[i][j*2],mT[i][j*2+1],0.0) * box_dim*1.5; 
       	else
        if(s==1.0)
        	box_or = vec3(mG[i][j*2],mG[i][j*2+1],0.0) * box_dim*1.5;
        else
        	box_or = vec3(mC[i][j*2],mC[i][j*2+1],0.0) * box_dim*1.5;
            
 		box_or += vec3(box_r*8.0 * (s-1.0) , -box_r , 0.0);            
        box_or +=  rnd*box_dim;
        bool hit_edge = ray_edge(vLookFrom,D , box_or-box_dim, box_or+box_dim);
        
        if(hit_edge)
        {
            gl_FragColor = vec4(0.75,0.8,1.0,1.0);            
        }
        else
        {
        	box_or +=  rnd*box_dim*3.0;
            bool hit = ray_aabb(vLookFrom,D , box_or-box_dim, box_or+box_dim, dist);

            if(hit && dist<min_dist)
            {
                min_dist = dist;
                vec3 Ip = vLookFrom + D*dist;
                float d = length(Ip-box_or) / (2.0 * box_r);
                d = pow(d,3.0);
                gl_FragColor = vec4(d,d,0,1.0);            
            }
        }
    }
}