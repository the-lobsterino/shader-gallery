#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat3 m = mat3( 0.00,  0.80,  0.60,
              -0.80,  0.36, -0.48,
              -0.60, -0.48,  0.64 );

float hash( float n ){
    return fract(sin(n)*43758.5453);
}


float noise( in vec3 x ){
    vec3 p = floor(x);
    vec3 f = fract(x);

    f = f*f*(3.0-2.0*f);

    float n = p.x + p.y*57.0 + 113.0*p.z;

    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                        mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                    mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                        mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
    return res;
}

float fbm( vec3 p ){
    float f = 0.0;

    f += 0.5000*noise( p ); p = m*p*2.02;
    f += 0.2500*noise( p ); p = m*p*2.03;
    f += 0.1250*noise( p ); p = m*p*2.01;
    f += 0.0625*noise( p );

    return f/0.9375;
}


float pot(vec3 ray){
	return 2.*length(ray)-1.1;
}

float table(vec3 ray){
	return ray.y + .6;
}

vec2 map(vec3 ray){
	vec2 d2 = vec2( table(ray), 2.0 );
	ray.y -= 0.75*pow(dot(ray.xz,ray.xz),3.);
	vec2 d1 = vec2(pot(ray),1.); 
	if(d2.x < d1.x) d1 = d2;
	return d1;
}

vec2 intersect( in vec3 ro, in vec3 rd ){
    float t=0.0;
    float dt = 0.06;
    float nh = 0.0;
    float lh = 0.0;
    float lm = -1.0;
    for(int i=0;i<80;i++){
        vec2 ma = map(ro+rd*t);
        nh = ma.x;
        if(nh>0.0) { lh=nh; t+=dt;  } lm=ma.y;
    }

    if( nh>0.0 ) return vec2(-1.0);
    t = t - dt*nh/(nh-lh);

    return vec2(t,lm);
}


vec3 normals(vec3 pos){
	vec3 e = vec3(0.001,0.,0.);
	vec3 n;
	n.x = map(pos + e.xyy).x - map(pos - e.xyy).x;
	n.y = map(pos + e.yxy).x - map(pos - e.yxy).x;
	n.z = map(pos + e.yyx).x - map(pos - e.yyx).x;
	return normalize(n);
}


float shadow(vec3 ro, vec3 rd){
    float res = 1.0;
    float dt = 0.1;
    float t = .04;
    for( int i=0; i<8; i++ ){
        float h = map(ro + rd*t).x;
        if( h>0.001 )
            res = min( res, 10.*h/t );
        else
            res = 0.0;
        t += dt;
    }
    return res;
}

/*
vec3 normals(vec3 pos, vec4 sph){
	return (pos - sph.xyz)/sph.w;

}
*/

vec3 tableColor(vec3 pos, vec3 nor){
	return vec3(1.,.2,.1);	
}

vec3 potColor(vec3 pos, vec3 nor){
	vec3 col = vec3(0.,1.,0.);
	float f = fbm(10.*pos);
	f = smoothstep(.7,.9, f);
	col = mix(col, vec3(0.), f);	
	return col;	
}

void main( void ) {
	vec2 s = vec2(resolution.x/resolution.y,1.);
	vec2 q = gl_FragCoord.xy/resolution.xy;
	vec2 p = 2.*q - 1.;
	p*= s;
	vec3 ro = 2.*vec3(cos(time),1.,sin(time));
	vec3 ww = normalize(vec3(0.) - ro);
	vec3 uu = normalize(cross(vec3(0.,1.,0.),ww));
	vec3 vv = normalize(cross(ww,uu));
	vec3 rd = normalize(-p.x*uu + p.y*vv + 1.5*ww);
	
	vec2 t = intersect(ro,rd);
	vec3 pos = ro + t.x*rd;
	float f = fbm(.5*pos);
	vec3 col = vec3(0.2);
	if(t.y > .5){
		vec3 nor = normals(pos);
		vec3 light = normalize(vec3(1.,0.5,0.7));
		vec3 bling = vec3(-light.x, light.y, -light.z);
		//vec3 nor = normals(pos, vec4(0.,0.,0.,1.));
		float bac = max(0.,.2+.8*dot(nor,bling));
		float sof = shadow(pos,light);
		float amb = .5+ .6*nor.y;
		float dif = dot(nor,light);
		float con = 1.;
		float rim = pow(1.2+dot(nor,rd),2.5);
		col = con*vec3(.1,.15,.2);
		col += amb*vec3(.1,.15,.2);
		col += dif*vec3(1.,.97,.9)*sof;
		col += bac*vec3(1.,.97,.8); 
		col = sqrt(col);
		col*=.9;
		
		if(t.y > 1.5){
			col *= tableColor(pos,nor);
		}else{
			col *= potColor(pos,nor);
		}
			
		col *= 2.*rim;		
	}else{
		col = vec3(f);
	}
	
	gl_FragColor = vec4(col,1.);

}