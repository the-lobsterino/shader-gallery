/*
 * Original shader from: https://www.shadertoy.com/view/WtVSWt
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// Created by Robert Śmietana (Logos) - 11.03.2020
// Bielsko-Biała, Poland, UE, Earth, Sol, Milky Way, Local Group, Laniakea :)



//--- camera stuff ---//

mat3 setCamera(in vec3 ro, in vec3 ta)
{
	vec3 cw = normalize(ta - ro);
	vec3 cp = vec3(0.0, 1.0, sin(0.59*iTime));
	vec3 cu = normalize(cross(cw, cp));
	vec3 cv = normalize(cross(cu, cw));

    return mat3(cu, cv, cw);
}


//--- scene description ---//

float distanceToScene(vec3 p)
{
	float dp = dot(p, p);
	
    p *= 3.0 / dp;
	p  = sin(3.0*p + iTime*vec3(0.0, -4.0, 0.0));

	float d = min(length(p.xz) - 0.15, length(p*p) - 0.1);

	return 0.6*d * dp*0.111111;
}


//--- cheap normal computing ---//

vec3 computeSurfaceNormal(vec3 p)
{
    float d = distanceToScene(p);
    
    return normalize(vec3(
        distanceToScene(p + vec3(0.001, 0.0, 0.0)) - d,
        distanceToScene(p + vec3(0.0, 0.001, 0.0)) - d,
        distanceToScene(p + vec3(0.0, 0.0, 0.001)) - d));
}


//--- output color ---//

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    
    //--- camera setup ---//
    
    float rtime = 0.35*iTime;
    
    vec2 p   = (-iResolution.xy + 2.0*fragCoord - 1.0) / iResolution.y;
 	vec3 pos = vec3(5.0 + 5.0*cos(rtime), 10.0*cos(1.2*rtime), 6.0 + 5.0*sin(0.78*rtime));
    vec3 tar = vec3(0.0);
    vec3 dir = setCamera(pos, tar) * normalize(vec3(p.xy, 11.6));  
    
    
    //--- distance to nearest object in the scene ---//
    
	float t = 0.0;
	for(int i = 0; i < 210; i++)
    {
		float d = distanceToScene(pos + t*dir);
		if(d < 0.003) break;
        
		t += d;

        
		//--- early skip of background pixels ---//
    
        if (t > 27.0)
        {
            fragColor = vec4(0.0);
            return;
        }
	}
    
    
    //--- output color depends on few things ---//
    
    vec3  sn = computeSurfaceNormal(pos + t*dir);			// surface normal
    float dc = clamp(dot(sn, normalize(pos)), 0.0, 1.0);	// diffuse component
    float sr = pow(dc, 100.0);								// specular reflection
    float od = length(pos + t*dir);							// distance to origin
    
	fragColor     = abs(dir.xzyz);
    fragColor    *= 0.2 + 0.8*dc;
    fragColor.yz *= clamp(od, 0.0, 1.0);
    fragColor    += sr;
    
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}