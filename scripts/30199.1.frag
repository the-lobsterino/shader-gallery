
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform sampler2D buf;

//Simple raymarching sandbox with camera

//Raymarching Distance Fields
//About http://www.iquilezles.org/www/articles/raymarchingdf/raymarchingdf.htm
//Also known as Sphere Tracing


// now with sloppy interactive heightmap. see e#30173.1 for details
// eh, surface normal isn't all there and bicubic is way slow

//Scene Start
// water surface
vec2 obj0(in vec3 p){
    //sample from old buffer for height
    vec2 pos = clamp(-p.xz * vec2(0.015,0.05) + 0.25, vec2(0.0), vec2(0.5,1.0));
    p.y = p.y + texture2D(buf,pos).a * 3.0;
    return vec2(p.y+3.0,0);
}
// water Color
vec3 obj0_c(in vec3 p){
               return vec3(0,1,1);
}

//Scene End

float watersim(sampler2D bb, vec2 uv)
{
	// controls
	const float exciter_size = 0.01; // hotspot diameter
	const float exciter_freq = 1.0; // hotspot frobnication, in Hz
	
	const float C = 1.68; // ripple speed
	const float D = 0.12; // distance
	const float U = 0.15; // viscosity - aka damping
	const float T = 0.05; // time passed between frames

	float aspect = resolution.y / resolution.x;
	vec2 ms = mouse * vec2(1., aspect);
	vec2 uva = uv * vec2(2.0, aspect);
	float excitement = cos(time * exciter_freq * 6.2831853) * 0.15 ;
	float exciter = excitement * (1.0 - step(exciter_size, length(uva - ms)));

	vec2 uvold = uv.x < 0.5 ? uv : uv - vec2(0.5,0.0);
	float old = texture2D(bb, clamp(uvold,vec2(0.0),vec2(0.49999,0.99999))).a;
	float older = texture2D(bb, clamp(uvold+vec2(0.5,0.0),vec2(0.5,0.0),vec2(1.0))).a;
	vec3 d = vec3(1.0 / resolution, 0.0);
        float oldneighbors =
		texture2D(bb, clamp(uvold - d.xz,vec2(0.0001),vec2(0.49999,.99999))).a +
		texture2D(bb, clamp(uvold + d.xz,vec2(0.0001),vec2(0.49999,.99999))).a +
		texture2D(bb, clamp(uvold - d.zy,vec2(0.0001),vec2(0.49999,.99999))).a +
		texture2D(bb, clamp(uvold + d.zy,vec2(0.0001),vec2(0.49999,.99999))).a
		- 2.0; // subtract 0.5 per sample to recover effective sign of each
	float amplitude = ((4.0 - 8.0 * C * C * T * T / (D * D)) / (U * T + 2.0) * (old - 0.5) * 2.0 +
                            (U * T - 2.0) / (U * T + 2.0) * (older - 0.5) * 2.0 +
                            (2.0 * C * C * T * T / (D * D)) / (U * T + 2.0) * oldneighbors * 2.0 + exciter)
				* 0.999; // dithering hack? noisier but nicer since ripples stay visible longer
	float fresh = (clamp(amplitude, -1.0, 1.0) * 0.5) + 0.5; //the interesting value
	return uv.x < 0.5 ? fresh : old;
}


void main(void){
    vec2 vPos=-1.0+2.0*gl_FragCoord.xy/resolution.xy;

    //Camera animation
    vec3 vuv=vec3(0,1,0);//Change camere up vector here
    vec3 prp=vec3(0,-1,8); //Change camera path position here
    vec3 vrp=vec3(0,0,0); //Change camere view here
    
    
    //Camera setup
    vec3 vpn=normalize(vrp-prp);
    vec3 u=normalize(cross(vuv,vpn));
    vec3 v=cross(vpn,u);
    vec3 vcv=(prp+vpn);
    vec3 scrCoord=vcv+vPos.x*u*resolution.x/resolution.y+vPos.y*v;
    vec3 scp=normalize(scrCoord-prp);
    
    //Raymarching
    const vec3 e=vec3(0.15,0,0);
    const float maxd=28.0; //Max depth
    
    vec2 s=vec2(0.1,0.0);
    vec3 c,p,n;
    
    float f=1.0;
    for(int i=0;i<50;i++){
        if (abs(s.x)<.01||f>maxd) break;
        f+=s.x;
        p=prp+scp*f;
        s=obj0(p);
    }
    
    if (f<maxd){
            c=obj0_c(p);
        n=normalize(
                    vec3(s.x-obj0(p-e.xyy).x,
                         s.x-obj0(p-e.yxy).x,
                         s.x-obj0(p-e.yyx).x));
        float b=dot(n,normalize(prp-p));
        gl_FragColor=vec4((b*c+pow(b,8.0))*(1.0-f*.001),0);//simple phong LightPosition=CameraPosition
    }
    else gl_FragColor=vec4(0,0,0,0); //background color
    gl_FragColor.a = watersim(buf,gl_FragCoord.xy/resolution);
}