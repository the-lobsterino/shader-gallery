

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
//thank for https://www.shadertoy.com/view/MdX3Rr by iq

#define PI 3.14159265359



float noise(in vec2 uv)
{
    return sin(uv.x/2.)+cos(uv.y*2.);
}


#define OCTAVES 8
float fbm(in vec2 uv,int octaves)
{
    //this function generates the terrain height
    float value = 0.;
    float amplitude = 1.;
    float freq = .5;
    float n1 = 0.;
    for (int i = 0; i < OCTAVES; i++)
    {
        n1 = (noise(uv * freq-n1)-n1);
        // From Dave_Hoskins https://www.shadertoy.com/user/Dave_Hoskins
        value = abs(value-(n1) * amplitude);
        
        amplitude *= 1./3.;
        
        freq *= 2.;
        
        uv = uv.yx;
        value *= .5+.2*noise(uv+n1*value);
        
        //value *= .9;

}
    
    return value;
}

float fbm(in vec2 uv){
    return fbm(uv,OCTAVES);
}
float terrainH( in vec2 p)
{
    p.x += iTime/2.;
    return fbm(p*1.5)*1.5;
}

float softShadow(in vec3 ro, in vec3 rd )
{
    // real shadows	
    float res = 1.1;
    float t = 5.0;
	for( int i=0; i<40; i++ )
	{
	    vec3  p = ro + t*rd;
        float h = p.y - terrainH( p.xz );
		res = min( res, 16.0*h/t );
		t += h;
		if( res<0.01 ||p.y>(200.0) ) break;
	}
	return clamp( res, 0.0, 1.0 );
}


float interesct( in vec3 ro, in vec3 rd, in float tmin, in float tmax )
{
    float t = tmin;
	for( int i=0; i<128; i++ )
	{
        vec3 pos = ro + t*rd;
		float h = pos.y - terrainH( pos.xz );
		if( h<(0.002*t) || t>tmax ) break;
		t += 0.5*h;
	}
	return t;
}


vec3 calcNormal( in vec3 pos, float t )
{
    vec2  eps = vec2( 0.002*t, 0.0 );
    return normalize( vec3( terrainH(pos.xz-eps.xy) - terrainH(pos.xz+eps.xy),
                            2.0*eps.x,
                            terrainH(pos.xz-eps.yx) - terrainH(pos.xz+eps.yx) ) );
}

vec3 render( in vec3 ro, in vec3 rd )
{   
    vec3 lightDir = normalize( vec3(-0.8,0.3,-0.3) );
    vec3 lightColor = vec3(1.0);
    vec3 sandColor = vec3(0.9,0.70,0.4);
    vec3 ambientColor = vec3(0.5);

    float tmin = 1.0;
    float tmax = 30.0;
    float t = interesct(ro,rd,tmin,tmax);

    vec3 col;
    if(t>tmax){
        vec3 sky0 = vec3(0.8,0.7,0.5) * 1.2;
        vec3 sky1 = vec3(0.4,0.6,0.8) * 1.2;
        col = mix(sky0,sky1,pow(max(rd.y + 0.15,0.0),0.5));
        col += vec3(pow(max(dot(rd,lightDir),0.0),50.0));
    }
    else{
        vec3 pos = ro + t*rd;
        
        float shadow = softShadow(pos + lightDir *0.01,lightDir);
        
        vec3 normal = calcNormal( pos, t );
        normal = normalize(normal + vec3(sin(pos.x * 100.0 + sin(pos.z * 31.0) + sin(pos.y) * 200.0) * 0.02,0,0));
        vec3 viewDir = -rd;

        float lambertian = max(dot(lightDir,normal), 0.0);

        float shininess =  20.0;
        vec3 halfDir = normalize(lightDir + viewDir);
        float specAngle = max(dot(halfDir, normal), 0.0);
        float specular1 = pow(specAngle, shininess);
        float specular2 = pow(specAngle, shininess / 2.0) * noise(pos.xz * 10000.0) * 1.0;// * pow(texture(iChannel0,pos.xz * 10.0).x,3.0);

        vec3 diff = sandColor * lambertian * lightColor;
        vec3 spec = (specular1 *0.3 + specular2 * 0.2) * lightColor;
        vec3 ambient = ambientColor * sandColor;
        col = shadow * (diff + spec) + ambient;

    }
    
    
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float time = iTime * 1./8.;
    //float yaw = time;//iMouse.x * 0.05;
    //float pitch = 1.2;//clamp(iMouse.y * 2.0 /iResolution.y,-PI * 0.5,PI * 0.5);
    
    float yaw;
    float pitch;
    
    if(iMouse.x == 0.0 && iMouse.y == 0.0){
    	yaw = time;
    	pitch = 1.2;        
    }
    else{
        yaw = iMouse.x * 0.05;
    	pitch = clamp(iMouse.y  * 2.0 /iResolution.y,-PI * 0.5,PI * 0.5);
    }
    
    vec2 p0 = fragCoord.xy / iResolution.xy;
    p0.x *= iResolution.x/iResolution.y;
    
    vec3 ro = 1.1*vec3(2.5*sin(0.25*yaw),2.5 * cos(pitch),2.5*cos(0.25*yaw));
    vec3 ww = normalize(vec3(0.0) - ro);
    vec3 uu = normalize(cross( vec3(0.0,1.0,0.0), ww ));
    vec3 vv = normalize(cross(ww,uu));
    vec3 rd = normalize( p0.x*uu + p0.y*vv + 2.5*ww );

    vec3 col = render( vec3(time,1.8,0.0), rd );
    
    fragColor = vec4(col,1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}