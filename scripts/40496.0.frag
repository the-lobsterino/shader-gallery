precision highp float;

uniform vec2 resolution;
uniform float time;

vec3 rotateX(vec3 p, float a)
{
  	float sa = sin(a);
  	float ca = cos(a);
  	return vec3(p.x, ca * p.y - sa * p.z, sa * p.y + ca * p.z);
}

vec3 rotateY(vec3 p, float a)
{
  	float sa = sin(a);
  	float ca = cos(a);
  	return vec3(ca * p.x + sa * p.z, p.y, -sa * p.x + ca * p.z);
}

vec3 rotateZ(vec3 p, float a)
{
  	float sa = sin(a);
  	float ca = cos(a);
  	return vec3(ca * p.x - sa * p.y, sa * p.x + ca * p.y, p.z);
}

vec3 trans(vec3 p, float m)
{
  	return mod(p, m) - m / 2.0;
}

float distSp1(vec3 pos)
{
	return length(trans(pos, 2.0)) - 1.0;
}

float distSp2(vec3 pos)
{
	return length(trans(pos, 2.0)) - 1.6;
}

float distanceFunction(vec3 pos)
{
	float d1 = distSp1( rotateX( trans(pos,2.0), time * -2.0 ) );
	float d2 = distSp2( rotateX( trans(pos,2.0), time * -2.0 ) );
	return min(d1, d2);
}
 
vec3 getNormal(vec3 p)
{
  	const float d = 0.001;
  	return normalize( 
		    vec3(
        		 distanceFunction(p+vec3(d,0.0,0.0))-distanceFunction(p+vec3(-d,0.0,0.0)),
        		 distanceFunction(p+vec3(0.0,d,0.0))-distanceFunction(p+vec3(0.0,-d,0.0)),
        		 distanceFunction(p+vec3(0.0,0.0,d))-distanceFunction(p+vec3(0.0,0.0,-d))
		    )
    	       );
}
 
void main()
{
  	vec2 pos = (gl_FragCoord.xy*2.0 -resolution) / resolution.y;
 	vec2 m = vec2(cos(time * 0.8) * 0.15, 0.5 + sin(time * 1.6) * 0.05);
  	vec3 camPos = vec3(m*-10.0, mod(time,1000.0));
	//vec3 camPos = vec3(mouse * -10.0, -1.0);
  	vec3 camDir = vec3(0.0, 0.0, -1.0);
  	vec3 camUp = vec3(0.0, 1.0, 0.0);
  	vec3 camSide = normalize(cross(camDir, camUp));
  	float focus = 1.8;
 
  	vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);
 
  	float t = 0.0, d;
  	vec3 posOnRay = camPos;
	
	vec3 lightColor = vec3(1.0);
	vec3 lightPosition = vec3(500.0, 1000.0, 1000.0);
 
	for(int i=0; i<60; ++i)
	{
		d = distanceFunction(posOnRay);
	    	t += d;
		//if(abs(d) < 0.001) break;
	    	posOnRay = camPos + t*rayDir;
	}
	 
	    
    
    	vec3 finalColor = vec3(0);
    
	if(abs(d) < 0.001)
	{
	    	    /* Cook-Torrance BRDF  http://ruh.li/GraphicsCookTorrance.html  */
		    // set important material values
		    float roughnessValue = 0.001; // 0.001: smooth, 1.0: rough
		    float F0 = 0.5; // fresnel reflectance at normal incidence
		    float k = 0.5; // fraction of diffuse reflection (specular reflection = 1 - k)
		    
		    
		    vec3 normal = getNormal(posOnRay);
		    vec3 lightDirection = normalize(lightPosition - posOnRay);
		    
		    // do the lighting calculation for each fragment.
		    float NdotL = max(dot(normal, lightDirection), 0.0);
		    
		    float specular = 0.0;
		    if(NdotL > 0.0)
		    {
				vec3 eyeDir = rayDir;
		
				// calculate intermediary values
				vec3 halfVector = normalize(lightDirection + eyeDir);
				float NdotH = max(dot(normal, halfVector), 0.00001); 
				float NdotV = max(dot(normal, eyeDir), 0.00001);
				float VdotH = max(dot(eyeDir, halfVector), 0.00001);
				float mSquared = roughnessValue * roughnessValue;
				
				// geometric attenuation
				float NH2 = 2.0 * NdotH;
				float g1 = (NH2 * NdotV) / VdotH;
				float g2 = (NH2 * NdotL) / VdotH;
				float geoAtt = min(1.0, min(g1, g2));
			     
				// roughness (or: microfacet distribution function)
				// beckmann distribution function
				float r1 = 1.0 / ( 4.0 * mSquared * pow(NdotH, 4.0) );
				float r2 = (NdotH * NdotH - 1.0) / (mSquared * NdotH * NdotH);
				float roughness = r1 * exp(r2);
				
				// fresnel
				// Schlick approximation
				float fresnel = pow(1.0 - VdotH, 5.0);
				fresnel *= (1.0 - F0);
				fresnel += F0;
				
				specular = (fresnel * geoAtt * roughness) / (NdotV * NdotL * 4.0);
	    	    }
		
		finalColor = vec3(0.0, 0.1, 0.2) + lightColor * NdotL * ( k + specular * (1.0 - k) );
		
	}
	
	gl_FragColor = vec4(finalColor, 1.0);
	
}