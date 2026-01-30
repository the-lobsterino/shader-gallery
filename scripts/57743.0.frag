#ifdef GL_ES
precision mediump float;
#endif

// Skrolli 3/2019 sivu 20 Listaus 4


#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 iResolution=resolution;

float sdf(vec3 p) // Donitsi
{
    vec3 offset=vec3(0.,1.3,-1.8);
    p.yz=vec2(p.y/sqrt(2.)+p.z/sqrt(2.),p.y/sqrt(2.)-p.z/sqrt(2.));
    p+=offset;
    return length(vec2(length(p.xz)-1.,p.y))-.3;
}

vec3 get_normal(vec3 pos) // Numeerinen approksimaatio pinnan normaalille
{
    vec3 eps=vec3(.01,0,0);
    return normalize(vec3(
            sdf(pos+eps.xyy)-sdf(pos-eps.xyy),
            sdf(pos+eps.yxy)-sdf(pos-eps.yxy),
            sdf(pos+eps.yyx)-sdf(pos-eps.yyx)
        ));
}

vec4 get_color(vec3 surface) // Pikselin väri Phongin valaistusmallilla
{
    vec3 normal=get_normal(surface);
    vec3 l=vec3(-1,-1,-.2); // Valon tulosuunta
    vec3 l_prime=l+2.*dot(l,normal)*normal;
    float cos_angle=max(dot(-l_prime,-surface),0.)/(length(l_prime)*length(-surface));
    vec3 specular=vec3(1.,1.,1.)*.8*pow(cos_angle,2.5);
    vec3 diffuse=vec3(1.,0.,0.)*.2*max(dot(normal,-l),0.);
    vec3 ambient=vec3(1.,0.,0.)*.3;
    return vec4(clamp(diffuse+specular+ambient,0.,1.),1.);
}

vec4 mainImage(in vec2 fragCoord){
    // Skaalataan pikseleiden koordinaatit välille [-1,1]
    vec2 pixel_pos=(fragCoord.xy/iResolution.xy-vec2(.5,.5))*2.;
    pixel_pos.x*=iResolution.x/iResolution.y;// Kuvasuhde
    // Luodaan säde kamerasta yhden yksikön päässä leijuvan
    // kuvitteellisen ikkunan läpi annetun pikselin kohdalta
    vec3 ray=normalize(vec3(pixel_pos.x,pixel_pos.y,-1.));
    // Tehdään 50 iteraatiota säteenaskellusta etäisyyskentän avulla
    vec3 pos=vec3(0.,0.,0.);
    for(int step=0;step<50;step++)
	    pos+=ray*sdf(pos);
    if(sdf(pos)>.01) // Ei osumaa
    	return vec4(0,0,0,1);
    else // Osuma
    	return get_color(pos);
}
    
void main()
{
    gl_FragColor=mainImage(gl_FragCoord.xy);
}