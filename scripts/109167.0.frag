#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



uniform vec3 spectrum;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D prevFrame;
uniform sampler2D prevPass;



float Circle( vec2 uv, float r) //r = entre zéro et 1
{
    return length(uv) - r;
}

float Box( in vec2 uv, float longueur, float largeur ) // b =  entre zéro et 1
{
vec2 b = vec2(longueur,largeur);
b = (resolution/vec2(1000))*b;
    vec2 d = abs(uv)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float ndot(vec2 a, vec2 b ) { return a.x*b.x - a.y*b.y; }
float Losange( in vec2 uv, in vec2 b )  // b =  entre zéro et 1
{
    uv = abs(uv);
    float h = clamp( ndot(b-2.0*uv,b)/dot(b,b), -1.0, 1.0 );
    float d = length( uv-0.5*b*vec2(1.0-h,1.0+h) );
    return d * sign( uv.x*b.y + uv.y*b.x - b.x*b.y );
}

float Triangle( in vec2 uv, in float r, in float Hauteur ) // r entre 0 et 1, Hauteur = 1 si equilateral;
{
    float k = sqrt(3.0*Hauteur);
    uv.x = abs(uv.x) - r;
    uv.y = uv.y + r/k+0.3;
    if( uv.x+k*uv.y>0.0 ) uv = vec2(uv.x-k*uv.y,-k*uv.x-uv.y)/2.0;
    uv.x -= clamp( uv.x, -2.0*r, 0.0 );
    return -length(uv)*sign(uv.y);
}

float Hexagon( in vec2 p, in float r )
{
    const vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -=0.5*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.t);
}



vec2 rotate(vec2 uv, float degree) {
    float s = sin(degree);
    float c = cos(degree);
    mat2 m = mat2(c, s, -s, c);
    return m * uv;
}

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}


//FONCTIONS:
//Box(UV, longueur,largeur)
//Triangle(uv,, taille, hauteur)
//Hexagon(uv, taille)
//rotate (uv, degrès)
//palette (float forme,  vec3,vec3,vec3,vec3)


vec3 ak = vec3(0.588, 0.498, 0.448);
vec3 bk = vec3(1.908, 0.500, 0.500);
vec3 ck = vec3(-0.165, 0.910, 0.910);
vec3 dk = vec3(0.068, 0.333, 0.608);








void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy )*2.-1.;

	
	
	
vec2 uv2=rotate(uv,time);


vec2 uv3=rotate(uv,uv.y*cos(time*10.+(length(uv))));

vec3 col= vec3(Triangle(uv3,cos(time),1.));


   
	
	
	
	
	
	
	
	
	
	gl_FragColor = vec4(col,1.);

}