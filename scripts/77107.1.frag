#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

#define time (dot(surfaceSize,surfaceSize))

// based on http://de.wikipedia.org/w/index.php?title=Datei:Newton-lplane-Mandelbrot-smooth.jpg&filetimestamp=20081017234443

// converted to GLSL by Kabuto. Note that the colors are different as I didn't use HSL.
vec2 cmul( vec2 a, vec2 b )  { return vec2( a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x ); }
vec2 cdiv( vec2 a, vec2 b )  { float d = dot(b,b); return vec2( dot(a,b), a.y*b.x - a.x*b.y ) / d; }
const int argd1 = 200;
const float argd4 = 3.;
vec2 cpow(vec2 c, float n){
float a = atan(c.y,c.x)*n;
float l = pow(length(c),n);
	return l*vec2(cos(a),sin(a));}
vec2 Nf (vec2 z, out vec2 r2, vec2 lambda)
{
    // *r2 = z^3+(lambda-1)*z-lambda
    // return (2*z^3+lambda)/(3*z*z+lambda-1)
	float po = time/10.+2.;
    vec2 z2 = cpow(z,po-1.);
 
    vec2 f = z2 + lambda - vec2(1,0);
    r2 = cmul(z,f)-lambda;
 
    vec2 N = po * z2 + lambda - vec2(1,0);
 
    vec2 Z = cmul(z,z2)*(po-1.)+lambda;
 
    return cdiv(Z,N);
}

vec3 getLambdaColor (float x, float y) {
    vec2 z = vec2(0);
    vec2 lambda =vec2(x,y);
 
    vec2 f;
    float eps = .001;
    float le = 1./log(eps);
	const float PI = 3.141592653589;
 
    for (int i=0; i < argd1; i++)
    {
        float v, s, h, b2;
        z = Nf(z, f, lambda);
 
        b2 = dot(f,f);
        if (b2 < eps*eps)
        {
            float b = 0.5*log(b2)*le;
            if (!(abs(b)<1e10)) b = 2.;
 
            b = float(i)-b;
            z = vec2(length(z),mod(atan(z.y,z.x),2.*PI));
            h = z.y/2./PI-.09;
 
            v = b / argd4;
            s = 0.9-0.7*pow(v, 1.5);
            if (v >= 1.)
            {
                float q = 1.-log (b-argd4)/log(float(argd1)-argd4);
                s = max(4.*q*(1.-q),0.);
                s = 0.2+0.6*pow(s, 10.);
                v = 1.;
            }
 
            return fract(vec3(h, s, v));
        }
    }
 
    return vec3(0);
}
 



void main( void ) {

	vec2 position = surfacePosition;//( gl_FragCoord.xy - resolution*.5) / resolution.y;
position+=vec2(1.,0.);
	gl_FragColor = vec4( getLambdaColor(position.x,position.y), 1.0 );

}

