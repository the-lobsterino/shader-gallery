#ifdef GL_ES
precision highp float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

vec3 fc;

// http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/
float field(in vec3 p) {
	float strength = .5;
	float accum = 0.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < 6; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag - vec3(mouse.y, length(mouse), mouse.x);
		float w = exp(-float(i) * 2.);
		accum += w * exp(-strength * pow(abs(mag - prev), 2.));
		tw += w;
		prev = mag;
	}
	float r = -abs(length(p)-tw)*accum;
	return r;
}

//raytracer from http://glsl.heroku.com/e#13140.0
vec2 map( vec3 p )
{
	float t = time * .1;
	float f =  field(p);
	float s = length(p);
	float r = mix(length(p)+3.,f, .95);
	return vec2(r, s);
}

vec2 intersect( in vec3 ro, in vec3 rd )
{
    float t=0.0;
    float dt = 0.05;
    float nh = 0.0;
    float lh = 0.0;
    float lm = -1.0;
    for(int i=0;i<64;i++)
    {
        vec2 ma = map(ro+rd*t);
        nh = ma.x;
        if(nh>0.0) { lh=nh; t+=dt;  } lm=ma.y;
    }

    if( nh>0.0 ) return vec2(t, -1.0);
    t = t - dt*nh/(nh-lh);

    return vec2(t,lm);
}

float softshadow( in vec3 ro, in vec3 rd, float mint, float maxt, float k )
{
    float res = 1.0;
    float dt = 0.085;
    float t = mint;
    for( int i=0; i<32; i++ )
    {
        float h = map(ro + rd*t).x;
        if( h>0.001 )
            res = min( res, k*h/t );
        else
            res = 0.0;
        t += dt;
    }
    return .5-res;
}

vec3 calcNormal( in vec3 pos )
{
    vec3  eps = vec3(.001,0.0,0.0);
    vec3 nor;
    nor.x = map(pos+eps.xyy).x - map(pos-eps.xyy).x;
    nor.y = map(pos+eps.yxy).x - map(pos-eps.yxy).x;
    nor.z = map(pos+eps.yyx).x - map(pos-eps.yyx).x;
    return normalize(nor);
}

void main(void)
{
    vec2 q = gl_FragCoord.xy / resolution.xy;
    vec2 p = -1.0 + 2.0 * q;
    p.x *= resolution.x/resolution.y;
 
    // camera
	float t = 0.2*time;
    vec3 ro = 2.5*normalize(vec3(cos(t),4.15+0.4*cos(t),sin(t)));
    vec3 ww = normalize(vec3(0.0,0.0,0.0) - ro);
    vec3 uu = normalize(cross( vec3(0.0,1.0,0.0), ww ));
    vec3 vv = normalize(cross(ww,uu));
    vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

    // raymarch
    vec2 tmat = intersect(ro,rd);
    vec3 bgcol = vec3(.9, .98, .95);
    float fog = 2./log(tmat.x);
    vec3 col = bgcol*fog;

    if( tmat.y != -1.)
    {
        // geometry
        vec3 pos = ro + tmat.x*rd;
        vec3 nor = calcNormal(pos);
        vec3 ref = reflect(rd,nor);
        vec3 lig = normalize(vec3(1.0,.8,-2.86));
     
        float con = 1.0;
        float amb = 0.5 + 0.5 * nor.y;
        float dif = max(dot(nor,lig),0.0);
        float bac = max(0.2 + 0.8*dot(nor,vec3(-lig.x,lig.y,-lig.z)),0.0);
        float rim = pow(1.0+dot(nor,rd),3.0);
        float spe = pow(clamp(dot(-lig,ref),0.0,1.0),16.0);

        // shadow
        float sh = softshadow( pos, lig, 0.01, 4.0, 4.0 );

        // lights
        col  = 0.10*con*vec3(0.80,0.90,1.00);
	col += (.25*ro)-0.70*dif*vec3(1.00,0.97,0.85)*vec3(sh, (sh+sh*sh)*0.5, sh*sh );
        col += 0.15*bac*vec3(1.00,0.97,0.85);
        col += 0.20*amb*vec3(0.10,0.15,0.20);


        // color
        vec2 pro = vec2(2.75, 1.2)/tmat.y;
      	
	// rim and spec
        col += 0.60*rim*vec3(1.0,0.97,0.85)*amb*amb;
        col += 0.60*pow(spe,pro.y)*vec3(1.0)*pro.x*sh;
        col = 0.3*col + 0.7*sqrt(col);
	col -= .05*tmat.x;
    }

    col *= 0.25 + 0.75*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.15 );

    gl_FragColor = vec4(col.r * q.y, col.g + .1 * ( q.x * q.y), col.b * q.x,1.0);
}//sphinx