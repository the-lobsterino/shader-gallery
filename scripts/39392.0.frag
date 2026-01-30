#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define iGlobalTime time
#define iMouse mouse*resolution
#define iResolution resolution

// https://www.shadertoy.com/view/XdlyWf

#define rot(spin) mat2(cos(spin),-sin(spin),sin(spin),cos(spin))

/*
what to fix:
positions are wrong
"sign(dir)*0.001" is wrong
*/

float map(vec3 p) {
    p = mod(p,3.0);
    vec3 q = p;
    //return dot(q-1.0,q-1.0)-max(abs(q.x)+q.y,-q.y)*max(abs(q.y)+q.z,-q.z)*max(abs(q.z)+q.x,-q.x); // the pifometer change
    //return dot(q-1.5,q-1.5)-3.5; // the pifometer change
    //return dot(p-1.0,p-1.0)-1.0;
    return 1.-dot(p-1.,p-1.);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
//    time = ;
	float t = iGlobalTime * .5;
	vec2 uv = (fragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
    
    
    vec3 cam = vec3(1.5,1.5,t);
    vec3 pos = cam;
    vec3 dir = normalize(vec3(uv,1.0));
    vec3 floorpos = floor(pos);
    vec3 mask;
    
    float dist = 0.0;
    vec3 localpos = pos;
    vec3 localfloor = floorpos;
    float stepsize = 1.0;
    float count = 0.0;
    
    
    for (int i = 0; i < 12; i++) {
        float len = map(localfloor);
        if (len > 0.0) {
            localpos *= 3.0;
            localpos = localpos-sign(dir)*1.5+1.5;
            
            localfloor = floor(localpos-sign(dir)*0.001);
            stepsize /= 3.0;
            
            if (count > 2.0) {
                break;
            }
            count ++;
        } else {
        
            vec3 dists = abs((sign(dir)*0.5+0.5)-(localpos-localfloor))*1.0/abs(dir);

            float m = min(min(dists.x,dists.y),dists.z);

            mask = step(dists,vec3(m));

            pos += m*dir*stepsize;
            dist += m*stepsize;
            localpos += m*dir;
            localfloor += mask*sign(dir);

            floorpos += mask*sign(dir)*stepsize;
        }
    }
    
	//fragColor = vec4(,1.0);
    fragColor = vec4((.5+.25*(sin((floorpos)*1.0+t)*0.5+0.5)+.25*mask)*.5/dist, 1);
}

void main( void ) {
	
	mainImage( gl_FragColor, gl_FragCoord.xy );


}