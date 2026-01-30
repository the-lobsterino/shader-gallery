/*

https://www.shadertoy.com/view/MtXcWB

Visualizes 
 a) a quadric as seen through a square frustum and 
 b) the min/max function range on frustum screen plane slices. 

Blue depth slices along ray t are outside, 
orange crossing surface, teal inside (fully occluded).

The black frizzy background of the graph is the ground truth:
a plot of all quadratic functions over all rays of the frustum.

The vertical lines are the analytically computed result.

This was done by building a bivariate quadratic function from 
sampling six ray functions at frustum edges and then computing
the bounds of that function. This is not the most straight forward
way to do this, but I wasn't considering any optimization yet.

It is possible to iterate towards the nearest depth of 
convex quadric objects within the frustum by using 
newton's method and differential derivatives.

I hope to eventually find a closed-form solution to compute the
four planes that interest me: near and far planes of 
the orange section, and the near and far plane of teal
sections. But I don't think there's much hope.

For non-convex quadrics such as cones one could build a 
trivariate quadratic function to bound it over intervals
of t, then use bisection with a bit of newton where applicable
to find the nearest and farthest crossing planes.



*/

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define GLSLSANDBOX

#define iTime time
#define iMouse mouse
#define iResolution resolution

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 texture(sampler2D,vec2 uv)
{
	return vec4( uv, dot(uv,uv), uv.x*uv.y );	
}

// polynomial arithmetic
// describes piecewise univariate polynomial with degree 2
struct poly2 {
    // the coefficients for f(x) = a0 * x^0 + a1 * x^1 + a2 * x^2
    vec3 a;
    // distance to horizon
    float h;
};

const float infinity = 1. / 0.;

bool hasaxis(poly2 f) {
    return (f.h != infinity);
}

poly2 pa_init(float x) {
    return poly2(vec3(x,1.0,0.0),infinity);
}

float merge_axes(poly2 f, poly2 g) {
    if (hasaxis(g)) {
        if (hasaxis(f)) {
            float a0 = min(f.h, g.h);
            float a1 = max(f.h, g.h);
            return ((a0 > 0.0)?a0:a1);
        } else {
            return g.h;
		}
    }
    return f.h;
}

poly2 pa_add(poly2 f, poly2 g) {
    return poly2(f.a + g.a,merge_axes(f,g));
}
poly2 pa_add(poly2 f, float c) {
    return poly2(vec3(f.a[0] + c,f.a[1],f.a[2]),f.h);
}
poly2 pa_add(float c, poly2 f) {
    return poly2(vec3(f.a[0] + c,f.a[1],f.a[2]),f.h);
}
poly2 pa_sub(poly2 f, poly2 g) {
    return poly2(f.a - g.a,merge_axes(f,g));
}
poly2 pa_sub(poly2 f, float c) {
    return poly2(vec3(f.a[0] - c,f.a[1],f.a[2]),f.h);
}
poly2 pa_sub(float c, poly2 f) {
    return poly2(vec3(c - f.a[0],-f.a[1],-f.a[2]),f.h);
}
poly2 pa_unm(poly2 f) {
    return poly2(-f.a,f.h);
}

// {a0 a1 a2} * {b0 b1 b2}
// = {a0*b0 (a0*b1 + a1*b0) (a0*b2 + a2*b0 + a1*b1) (a1*b2 + a2*b1) (a2*b2)}
// the two new coefficients are truncated, so only linear
// functions are going to work here reliably.
poly2 pa_mul(poly2 f, poly2 g) {
    return poly2(vec3(
    	f.a[0] * g.a[0],
	    f.a[0] * g.a[1] + f.a[1] * g.a[0],
        f.a[0] * g.a[2] + f.a[1] * g.a[1] + f.a[2] * g.a[0]
        //f.a[1] * g.a[2] + f.a[2] * g.a[1],
        //f.a[2] * g.a[2]
        ), f.h);
}
poly2 pa_mul(poly2 f, float c) {
    return poly2(f.a * c,f.h);
}
poly2 pa_mul(float c, poly2 f) {
    return poly2(f.a * c,f.h);
}

// the two new coefficients are truncated, so only linear
// functions are going to work here reliably.
poly2 pa_pow2(poly2 f) {
    return poly2(vec3(
    	f.a[0] * f.a[0],
	    2.0 * f.a[0] * f.a[1],
        2.0 * f.a[0] * f.a[2] + f.a[1] * f.a[1]
        //2.0 * f.a[1] * f.a[2],
        //f.a[2] * f.a[2]
        ), f.h);
}

// returns f(x), f'(x), f''(x)
vec3 pa_f(vec3 a, float x) {
    return vec3(
        a[0] + (a[1] +       a[2] * x) * x,
                a[1] + 2.0 * a[2] * x,
                             a[2]);
}

float solve_quadratic(vec3 fa, float x) {
    float a = fa[2];
    float b = fa[1];
    float c = fa[0];

    // the quadratic solve doesn't work for a=0
    // so we need a branch here.
    if (a == 0.0) {
        return -c / b;
    } else {
        // (-b +- sqrt(b*b - 4.0*a*c)) / 2.0*a
        float k = -0.5*b/a;
        float q = sqrt(k*k - c/a);
        float q0 = k - q;
        float q1 = k + q;

        // pick the root right of x
		return (q0 <= x)?q1:q0;
    }
}

float solve_quadratic0(vec3 fa) {
    float a = fa[2];
    float b = fa[1];
    float c = fa[0];

    // the quadratic solve doesn't work for a=0
    // so we need a branch here.
    if (a == 0.0) {
        return -c / b;
    } else {
        // (-b +- sqrt(b*b - 4.0*a*c)) / 2.0*a
        float k = -0.5*b/a;
        float q = sqrt(k*k - c/a);
        // pick the closest root right of 0
		return k + ((k <= q)?q:-q);
    }
}

vec2 solve_quadratic2(vec3 fa) {
    float a = fa[2];
    float b = fa[1];
    float c = fa[0];

    // the quadratic solve doesn't work for a=0
    // so we need a branch here.
    if (a == 0.0) {
        return vec2(-c / b);
    } else {
        // (-b +- sqrt(b*b - 4.0*a*c)) / 2.0*a
        float k = 0.5*b/a;
        float q = sqrt(k*k - c/a);
		return vec2(-k, q);
    }
}

float solve_quadratic(poly2 f) {
    return solve_quadratic0(f.a);
}

// returns the x position of the next root, where f(x) = 0
float nextroot(poly2 f) {
    return solve_quadratic(f);
}

// returns the position of the next event (root or start of new segment)
float nextevent(poly2 f) {
    float s = nextroot(f);
    float h = (f.h <= 0.0)?infinity:f.h;
    s = (s <= 0.0)?h:min(s,h);
    return s;
}

float axis(poly2 f) {
    return nextevent(f);
}

float pa_sign(poly2 f) {
    return ((f.a[0] < 0.0)?-1.0:1.0);
}

// signed pow2; this is for transforming linear distance functions
// to quadratic ones so they compare correctly against spherical functions
// the position of the root is not altered
poly2 pa_spow2(poly2 f) {
    return pa_mul(pa_pow2(f), pa_sign(f));
}

poly2 pa_abs(poly2 f) {
    float s = pa_sign(f);

    f.h = axis(f);

    return poly2(f.a * s, f.h);
}

poly2 pa_const(float c) {
    return poly2(vec3(c,0.0,0.0), infinity);
}

poly2 pa_ipol(vec2 a, vec2 b) {
    float a1 = (a.y - b.y)/(a.x - b.x);
	float a0 = a.y - a1*a.x;
    return poly2(vec3(a0, a1, 0.0), infinity);
}

poly2 pa_ipol(vec2 a, vec2 b, float k) {
    float a2 = 0.5*k;
    float aa2 = a2*a.x*a.x;
    float a1 = (a.y - b.y + a2*b.x*b.x - aa2) / (a.x - b.x);
    float a0 = a.y - a1*a.x - aa2;
    return poly2(vec3(a0, a1, a2), infinity);
}

poly2 pa_min(poly2 f, poly2 g) {
    float h = axis(pa_sub(f,g));
    float fx = f.a[0];
    float gx = g.a[0];
    return poly2((fx < gx)?f.a:g.a, h);
}

poly2 pa_max(poly2 f, poly2 g) {
    float h = axis(pa_sub(f,g));
    float fx = f.a[0];
    float gx = g.a[0];
    return poly2((fx > gx)?f.a:g.a, h);

}

// the output can only be subject to more comparisons, but must not
// be transformed further.
poly2 pa_hardmin(poly2 f, poly2 g) {
#ifdef USE_HARDMIN
    float fe = nextevent(f);
    float ge = nextevent(g);
    float h = axis(pa_sub(f,g));
    float fx = f.a[0];
    float gx = g.a[0];
    bool fi = (fx < 0.0);
    bool gi = (gx < 0.0);
    // both outside
    if (!fi && !gi) {
        if (fe <= ge)
            return f;
        else
            return g;
    // both inside
    } else if (fi && gi) {
        if (fe <= ge)
            return f;
        else
            return g;
    } else {
        return poly2((fx < gx)?f.a:g.a, h);
    }
#else
    float h = axis(pa_sub(f,g));
    float fx = f.a[0];
    float gx = g.a[0];
    return poly2((fx < gx)?f.a:g.a, h);
#endif
}

// the output can only be subject to more comparisons, but must not
// be transformed further.
poly2 pa_hardmax(poly2 f, poly2 g) {
    return pa_unm(pa_hardmin(pa_unm(f),pa_unm(g)));
}

// can only be used once on flat surfaces reliably
// appears to still work with more complex functions?
poly2 pa_smin(poly2 a, poly2 b, float r) {
    poly2 e = pa_min(
        pa_max(
            pa_add(
                pa_unm(
                    pa_abs(
                        pa_sub(a, b))), r),
            pa_const(0.0)),pa_const(r));
    return pa_sub(pa_min(a, b), pa_mul(pa_pow2(e), 0.25 / r));
}

poly2 pa_smax(poly2 a, poly2 b, float r) {
    return pa_unm(pa_smin(pa_unm(a),pa_unm(b),r));
}

// approximates blend with a quadratic patch, but
// very buggy. avoid.
poly2 pa_smin2(poly2 a, poly2 b, float r) {
    float h = solve_quadratic0(pa_sub(a, b).a);
    float x0 = h - r;
    float x1 = h + r;
    if (0.0 < x0) {
        a.h = x0;
        return a;
    } else if (0.0 >= x1) {
        return b;
    } else {
        vec3 ay0 = pa_f(a.a, x0);
        vec3 by0 = pa_f(b.a, x0);
        vec3 ay1 = pa_f(a.a, x1);
        vec3 by1 = pa_f(b.a, x1);
        vec3 y0 = (ay0.x < by0.x)?ay0:by0;
        vec3 y1 = (ay1.x < by1.x)?ay1:by1;
        poly2 m = pa_ipol(vec2(x0, y0.x), vec2(x1, y1.x), (y1.y - y0.y) / (x1 - x0));
        m.h = x1;
    	return m;
    }
}

vec3 ro;
vec3 rd;

poly2 sphere(poly2 x, poly2 y, poly2 z, float r) {
    return pa_sub(pa_add(pa_add(pa_pow2(x),pa_pow2(y)),pa_pow2(z)), r*r);
}

poly2 ellipsoid(poly2 x, poly2 y, poly2 z, vec3 r) {
    poly2 ex = pa_pow2(pa_mul(x, 1.0/r.x));
    poly2 ey = pa_pow2(pa_mul(y, 1.0/r.y));
    poly2 ez = pa_pow2(pa_mul(z, 1.0/r.z));
    return pa_sub(pa_add(pa_add(ex,ey),ez), 1.0);
}

poly2 quadric(poly2 x, poly2 y, poly2 z, vec3 abc, float r){//ax^2+by^2+cz^2=r^2
	poly2 ex = pa_mul(pa_pow2(x), abc.x);		//cone=vec3(1.0,-1.0,1.0)
	poly2 ey = pa_mul(pa_pow2(y), abc.y);		//cyl=vec3(1.0,0.0,1.0)
	poly2 ez = pa_mul(pa_pow2(z), abc.z);		//ellipse=vec3(0.5,2.0,1.0)
	return pa_sub(pa_add(pa_add(ex,ey),ez), abs(r)*r); //allows negative r parabola=vec3(1.0,-1.0,1.0),-0.5
}

poly2 cube(poly2 x, poly2 y, poly2 z, float r) {
#if 1
	return pa_sub(pa_max(pa_max(pa_abs(x),pa_abs(y)),pa_abs(z)),r);
#else
    poly2 d = pa_max(pa_max(pa_abs(x),pa_abs(y)),pa_abs(z));
    return pa_sub(pa_spow2(d),r * r);
#endif
}

poly2 plane(poly2 x, poly2 y, poly2 z, vec4 n) {
#if 1
	return pa_sub(pa_add(pa_add(pa_mul(x,n.x),pa_mul(y,n.y)),pa_mul(z,n.z)),n.w);
#else
    poly2 d = pa_add(pa_add(pa_mul(x,n.x),pa_mul(y,n.y)),pa_mul(z,n.z));
    return pa_sub(pa_spow2(d),n.w * n.w * sign(n.w));
#endif
}

/*
// not really a cone - todo :|
poly2 cone(poly2 x, poly2 y, poly2 z, vec2 a, float l) {
    return pa_max(
        pa_add(pa_mul(pa_add(pa_pow2(x),pa_pow2(y)),a.x),
               pa_mul(a.y, z)),z);
}
*/

void rotate(poly2 x, poly2 y, out poly2 rx, out poly2 ry, float a) {
    float c = cos(a);
    float s = sin(a);
    rx = pa_sub(pa_mul(x,c),pa_mul(y,s));
    ry = pa_add(pa_mul(x,s),pa_mul(y,c));
}

float anim_time;
poly2 pa_map(poly2 x, poly2 y, poly2 z) {
#if 0
	poly2 w = plane(x, y, z, vec4(0.0,0.0,1.0,-0.6));
    poly2 vz = pa_sub(z,sin(anim_time*0.3)*0.4);
	poly2 s = sphere(pa_sub(x,1.0),y,vz, 0.5);
	poly2 s2 = sphere(pa_sub(x,0.65),y,vz, 0.3);
	//poly2 c = cone(pa_sub(x,-0.5),y,pa_sub(z,-0.3), normalize(vec2(1.0,0.5)), 0.5);
    poly2 rx, rz;
    rotate(pa_sub(x,-0.5),pa_sub(z,-0.5),rx,rz,anim_time*0.5);
    poly2 c = ellipsoid(rx,y,rz,vec3(0.2,0.5,0.5));
    poly2 cb = cube(rx,y,pa_add(rz,-0.5),0.2);

    poly2 d = pa_hardmax(s,pa_unm(s2));
    d = pa_hardmin(d,w);
    d = pa_hardmin(d, c);
    d = pa_hardmin(d, cb);
#else
    float a = iTime;//.5;
    rotate(x,y,x,y,a*0.79);//anim_time*0.5);
    //rotate(y,z,y,z,a*0.49);//anim_time*0.5);
    rotate(x,z,x,z,a*0.69);

    //poly2 d = ellipsoid(x,y,z, vec3(0.5,0.4,0.3));
    //poly2 d = ellipsoid(x,y,z, vec3(0.5,0.45,0.2));
    poly2 d = quadric(x,y,z, vec3(1.0/0.5,1.0/0.45,1.0/0.2), 1.0);
    //poly2 d = plane(x,y,z, vec4(0.0,0.0,1.0,-0.6));
    //poly2 d = cube(x,y,z,0.5);
    //poly2 d = sphere(x,y,z, 0.5);
#endif
	return d;
}

poly2 pa_map(vec3 ro, vec3 rd, float t) {
    poly2 dt = pa_init(t);
    poly2 x = pa_add(ro.x, pa_mul(rd.x, dt));
    poly2 y = pa_add(ro.y, pa_mul(rd.y, dt));
    poly2 z = pa_add(ro.z, pa_mul(rd.z, dt));
    return pa_map(x,y,z);
}

// how to convert pa_map to a classic map function
// t is the ray scalar
// returns function value at that point, and distance
// to next root or horizon
vec3 map(vec3 ro, vec3 rd, float t) {
    poly2 f = pa_map(ro, rd, t);
    return vec3(f.a[0], nextevent(f), f.a[1]);
}

void setup() {
    anim_time = 0.0;
}

float tri(float x) {
    return 2.0 * abs( floor(x*0.5+0.5) - 0.5*x );
}

void prepare_ray(float s, float t) {
    //s = 0.0;
    float q = tri(iTime*0.3);
    vec2 c = vec2(mix(0.0,3.2,q),0.0);
    vec2 w = vec2(1.0,1.0)*mix(0.1,1.5,q);
    s = s*2.0 - 1.0;
    t = t*2.0 - 1.0;
    vec3 p1 = vec3(c + w*vec2(s,t), 0.0);
    vec3 p0 = vec3(p1.xy * 0.0, -1.0);
    ro = p0;
    rd = p1 - p0;
}

// return the quadratic that fits y values at f(0), f(0.5) and f(1)
vec3 quadratic_from_points(float y0, float y1, float y2) {
    float a = 2.0*y0 - 4.0*y1 + 2.0*y2;
    float b = -3.0*y0 + 4.0*y1 - y2;
    float c = y0;
    return vec3(c, b, a);
}

// this one fits f(-1), f(0) and f(1)
vec3 quadratic_from_points_c(float y0, float y1, float y2) {
	float A = (y2 + y0)/2.0 - y1;
	float B = (y2 - y0)/2.0;
	float C = y1;
    return vec3(C, B, A);
}

vec3 quadratic_from_points(vec2 p1, vec2 p2, vec2 p3) {
	float d = (p1.x - p2.x)*(p1.x - p3.x)*(p2.x - p3.x);
	float a = p3.x * (p2.y - p1.y) + p2.x * (p1.y - p3.y) + p1.x * (p3.y - p2.y);
	float b = p3.x*p3.x * (p1.y - p2.y) + p2.x*p2.x * (p3.y - p1.y) + p1.x*p1.x * (p2.y - p3.y);
	float c = p2.x * p3.x * (p2.x - p3.x) * p1.y + p3.x * p1.x * (p3.x - p1.x) * p2.y + p1.x * p2.x * (p1.x - p2.x) * p3.y;
    return vec3(c, b, a) / d;
}

struct poly2x2 {
    vec3 abc;
    vec3 def;
};
// compute the six coefficients of a bivariate quadratic
// f(x,y) = A*x^2 + B*y^2 + C*x + D*y + E*x*y + F
// so that the surface goes through the points
// f(0,0) = Q
// f(0,1) = R
// f(1,0) = S
// f(1,1) = T
// f(0.5,0) = U
// f(0,0.5) = V
poly2x2 bivariate_quadratic_from_points(
    float Q, float R, float S, float T, float U, float V) {
    float A = 2.0*Q - 4.0*U + 2.0*S;
    float B = 2.0*Q - 4.0*V + 2.0*R;
    float C = -3.0*Q + 4.0*U - S;
    float D = -3.0*Q + 4.0*V - R;
    float E = Q + T - S - R;
    float F = Q;
    return poly2x2(vec3(A,B,C),vec3(D,E,F));
}

// same but for the points
// f( 0, 0) = Q
// f(-1, 0) = R
// f( 1, 0) = S
// f( 0,-1) = T
// f( 0, 1) = U
// f( 1, 1) = V
poly2x2 bivariate_quadratic_from_points_c(
    float Q, float R, float S, float T, float U, float V) {
    float A = (S + R)/2.0 - Q;
    float B = (U + T)/2.0 - Q;
    float C = (S - R)/2.0;
    float D = (U - T)/2.0;
    float E = Q + V - S - U;
    float F = Q;
    return poly2x2(vec3(A,B,C),vec3(D,E,F));
}

float pa_f(poly2x2 p, float x, float y) {
    return dot(p.abc,vec3(x*x,y*y,x)) + dot(p.def,vec3(y,x*y,1.0));
}
// first partial derivatives
vec2 pa_ff(poly2x2 p, float x, float y) {
    float A = p.abc[0];
    float B = p.abc[1];
    float C = p.abc[2];
    float D = p.def[0];
    float E = p.def[1];
    return vec2(2.0*A*x + C + E*y, 2.0*B*y + D + E*x);
}
// second partial derivatives
vec2 pa_fff(poly2x2 p, float x, float y) {
    float A = p.abc[0];
    float B = p.abc[1];
    return vec2(2.0*A, 2.0*B);
}

struct poly2x3 {
    vec4 abcd;
    vec4 efgh;
    vec2 ij;
};

// compute the ten coefficients of a trivariate quadratic
// f(x,y,z) = A*x^2 + B*y^2 + C*z^2 + D*x + E*y + F*z + G*x*y + H*x*z + I*y*z + J
// so that the surface goes through the points
// f( 0, 0, 0) = N
// f(-1, 0, 0) = O
// f( 1, 0, 0) = P
// f( 0,-1, 0) = Q
// f( 0, 1, 0) = R
// f( 0, 0,-1) = S
// f( 0, 0, 1) = T
// f( 1, 1, 0) = U
// f( 1, 0, 1) = V
// f( 0, 1, 1) = W
poly2x3 trivariate_quadratic_from_points_c(
    float N, float O, float P, float Q, float R,
    float S, float T, float U, float V, float W) {
    float A = (P + O)/2.0 - N;
    float B = (R + Q)/2.0 - N;
    float C = (T + S)/2.0 - N;
    float D = (P - O)/2.0;
    float E = (R - Q)/2.0;
    float F = (T - S)/2.0;
    float G = U + N - P - R;
    float H = V + N - P - T;
    float I = W + N - R - T;
    float J = N;
    return poly2x3(vec4(A,B,C,D),vec4(E,F,G,H),vec2(I,J));
}
float pa_f(poly2x3 p, float x, float y, float z) {
    return dot(p.abcd,vec4(x*x,y*y,z*z,x))
        + dot(p.efgh,vec4(y,z,x*y,x*z))
        + dot(p.ij,vec2(y*z,1.0));
}
struct interval {
    float i0;
    float i1;
};

interval inew(vec3 a, vec3 b) {
    if (a.x < b.x)
        return interval(a.x, b.x);
    else
        return interval(b.x, a.x);
}
interval iunion(interval a, vec3 b) {
    if (b.x < a.i0) {
        return interval(b.x, a.i1);
	} else if (b.x >= a.i1) {
        return interval(a.i0, b.x);
    } else {
        return a;
    }
}
interval iunion(interval a, interval b) {
    return iunion(iunion(a, vec3(b.i0,0.0,0.0)),vec3(b.i1,0.0,0.0));
}

// for a univariate quadratic f(x), return the min/max bounds
// within the range x=0..1
interval quadratic_bounds(vec3 p) {
    float A = p[2];
    float B = p[1];
    float C = p[0];
	vec3 c0 = pa_f(p, 0.0);
    vec3 c1 = pa_f(p, 1.0);
    interval iv = inew(c0, c1);
    if (abs(A) < 1e-8) {
        return iv;
    }
    float x = -B / (2.0*A);
    if (abs(x - 0.5) <= 0.5) {
	    vec3 h = pa_f(p, x);
        iv = iunion(iv, h);
	}
    return iv;
}

// for a bivariate quadratic f(x,y), return the min/max bounds
// within the range x=0..1, y=0..1
interval bivariate_quadratic_bounds(poly2x2 p) {
	float c0 = pa_f(p, 0.0, 0.0);
    float c1 = pa_f(p, 0.0, 1.0);
    float c2 = pa_f(p, 1.0, 0.0);
    float c3 = pa_f(p, 1.0, 1.0);
    float c4 = pa_f(p, 0.5, 0.0);
    float c5 = pa_f(p, 0.5, 1.0);
    float c6 = pa_f(p, 0.0, 0.5);
    float c7 = pa_f(p, 1.0, 0.5);
    // check borders
    interval b0 = quadratic_bounds(quadratic_from_points(c0,c4,c2));
    interval b1 = quadratic_bounds(quadratic_from_points(c1,c5,c3));
    interval b2 = quadratic_bounds(quadratic_from_points(c0,c6,c1));
    interval b3 = quadratic_bounds(quadratic_from_points(c2,c7,c3));
    interval iv = iunion(iunion(b0,b1),iunion(b2,b3));
    float A = p.abc[0];
    float B = p.abc[1];
    float C = p.abc[2];
    float D = p.def[0];
    float E = p.def[1];
    float F = p.def[2];
    float det = 4.0*A*B - E*E;
    float dx = 2.0*B*C - D*E;
    float dy = 2.0*A*D - C*E;
	if (abs(det) < 1e-8) {
        if (max(abs(dx),abs(dy)) < 1e-8) {
	        // parabolic cylinder
            // A > 0: minimum; A < 0: maximum
            // todo
            // return vec2(0.0);
        } else {
	        // parabolic cylinder
            // no apex
        }
        //return vec2(0.0);
    } else if (det > 0.0) {
        // graph is an elliptic paraboloid
        // A > 0: minimum; A < 0: maximum
        float xm = -dx / det;
        float ym = -dy / det;
        if (max(abs(xm - 0.5),abs(ym - 0.5)) <= 0.5) {
	        float h = pa_f(p, xm, ym);
            iv = iunion(iv, vec3(h,0.0,0.0));
        }
    } else { // (det < 0.0)
        // no apex; graph is a hyperbolic paraboloid
    }
    return iv;
}

interval bound_slice(float t) {
	prepare_ray(0.0,0.0);
    poly2 f00 = pa_map(ro, rd, 0.0);
	prepare_ray(0.0,1.0);
    poly2 f02 = pa_map(ro, rd, 0.0);
	prepare_ray(1.0,0.0);
    poly2 f20 = pa_map(ro, rd, 0.0);
	prepare_ray(1.0,1.0);
    poly2 f22 = pa_map(ro, rd, 0.0);
	prepare_ray(0.5,0.0);
    poly2 f10 = pa_map(ro, rd, 0.0);
	prepare_ray(0.0,0.5);
    poly2 f01 = pa_map(ro, rd, 0.0);

    vec3 e00 = pa_f(f00.a, t);
    vec3 e02 = pa_f(f02.a, t);
    vec3 e20 = pa_f(f20.a, t);
    vec3 e22 = pa_f(f22.a, t);
    vec3 e10 = pa_f(f10.a, t);
    vec3 e01 = pa_f(f01.a, t);

    poly2x2 f = bivariate_quadratic_from_points(e00.x, e02.x, e20.x, e22.x, e10.x, e01.x);

    return bivariate_quadratic_bounds(f);
}

const float coeff_scale = 0.025;
float rayf(float t) {
#if 1
    poly2 f = pa_map(ro, rd, t);
    return f.a[0]*coeff_scale;
#elif 0
    prepare_ray(t, 0.5);
    poly2 f = pa_map(ro, rd, 0.0);
    return f.a[2]*coeff_scale;
#else
    poly2 f = pa_map(ro, rd, 0.0);
    return pa_f(f.a, t).x*coeff_scale;
#endif
}

float fieldf(vec2 p) {
	prepare_ray(p.x, p.y);
    poly2 f = pa_map(ro, rd, 0.0);
    float t = solve_quadratic0(f.a);
    return max(t,0.0);
}

float coeff_ray_t;
float coeff_f(float t) {
    prepare_ray(0.0, t);
    poly2 f = pa_map(ro, rd, coeff_ray_t);
    return f.a[1]*coeff_scale;
}

// interface
//////////////////////////////////////////////////////////

// set color source for stroke / fill / clear
void set_source_rgba(vec4 c);
void set_source_rgba(float r, float g, float b, float a);
void set_source_rgb(vec3 c);
void set_source_rgb(float r, float g, float b);
void set_source_linear_gradient(vec3 color0, vec3 color1, vec2 p0, vec2 p1);
void set_source_linear_gradient(vec4 color0, vec4 color1, vec2 p0, vec2 p1);
void set_source_radial_gradient(vec3 color0, vec3 color1, vec2 p, float r);
void set_source_radial_gradient(vec4 color0, vec4 color1, vec2 p, float r);
void set_source(sampler2D image);
// control how source changes are applied
const int Replace = 0; // default: replace the new source with the old one
const int Alpha = 1; // alpha-blend the new source on top of the old one
const int Multiply = 2; // multiply the new source with the old one
void set_source_blend_mode(int mode);
// if enabled, blends using premultiplied alpha instead of
// regular alpha blending.
void premultiply_alpha(bool enable);

// set line width in normalized units for stroke
void set_line_width(float w);
// set line width in pixels for stroke
void set_line_width_px(float w);
// set blur strength for strokes in normalized units
void set_blur(float b);

// add a circle path at P with radius R
void circle(vec2 p, float r);
void circle(float x, float y, float r);
// add an ellipse path at P with radii RW and RH
void ellipse(vec2 p, vec2 r);
void ellipse(float x, float y, float rw, float rh);
// add a rectangle at O with size S
void rectangle(vec2 o, vec2 s);
void rectangle(float ox, float oy, float sx, float sy);
// add a rectangle at O with size S and rounded corner of radius R
void rounded_rectangle(vec2 o, vec2 s, float r);
void rounded_rectangle(float ox, float oy, float sx, float sy, float r);

// set starting point for curves and lines to P
void move_to(vec2 p);
void move_to(float x, float y);
// draw straight line from starting point to P,
// and set new starting point to P
void line_to(vec2 p);
void line_to(float x, float y);
// draw quadratic bezier curve from starting point
// over B1 to B2 and set new starting point to B2
void curve_to(vec2 b1, vec2 b2);
void curve_to(float b1x, float b1y, float b2x, float b2y);
// connect current starting point with first
// drawing point.
void close_path();

// clear screen in the current source color
void clear();
// fill paths and clear the path buffer
void fill();
// fill paths and preserve them for additional ops
void fill_preserve();
// stroke paths and clear the path buffer
void stroke_preserve();
// stroke paths and preserve them for additional ops
void stroke();
// clears the path buffer
void new_path();

// return rgb color for given hue (0..1)
vec3 hue(float hue);
// return rgb color for given hue, saturation and lightness
vec3 hsl(float h, float s, float l);
vec4 hsl(float h, float s, float l, float a);

// rotate the context by A in radians
void rotate(float a);
// uniformly scale the context by S
void scale(float s);
// non-uniformly scale the context by S
void scale(vec2 s);
void scale(float sx, float sy);
// translate the context by offset P
void translate(vec2 p);
void translate(float x, float y);
// clear all transformations for the active context
void identity_matrix();
// transform the active context by the given matrix
void transform(mat3 mtx);
// set the transformation matrix for the active context
void set_matrix(mat3 mtx);

// return the active query position for in_fill/in_stroke
// by default, this is the mouse position
vec2 get_query();
// set the query position for subsequent calls to
// in_fill/in_stroke; clears the query path
void set_query(vec2 p);
// true if the query position is inside the current path
bool in_fill();
// true if the query position is inside the current stroke
bool in_stroke();

// return the transformed coordinate of the current pixel
vec2 get_origin();
// draw a 1D graph from coordinate p, result f(p.x),
// and gradient1D(f,p.x)
void graph(vec2 p, float f_x, float df_x);
// draw a 2D graph from coordinate p, result f(p),
// and gradient2D(f,p)
void graph(vec2 p, float f_x, vec2 df_x);
// adds a custom distance field as path
// this field will not be testable by queries
void add_field(float c);

// returns a gradient for 1D graph function f at position x
#define gradient1D(f,x) (f(x + get_gradient_eps()) - f(x - get_gradient_eps())) / (2.0*get_gradient_eps())
// returns a gradient for 2D graph function f at position x
#define gradient2D(f,x) vec2(f(x + vec2(get_gradient_eps(),0.0)) - f(x - vec2(get_gradient_eps(),0.0)),f(x + vec2(0.0,get_gradient_eps())) - f(x - vec2(0.0,get_gradient_eps()))) / (2.0*get_gradient_eps())
// draws a 1D graph at the current position
#define graph1D(f) { vec2 pp = get_origin(); graph(pp, f(pp.x), gradient1D(f,pp.x)); }
// draws a 2D graph at the current position
#define graph2D(f) { vec2 pp = get_origin(); graph(pp, f(pp), gradient2D(f,pp)); }

// represents the current drawing context
// you usually don't need to change anything here
struct Context {
    // screen position, query position
    vec4 position;
    vec2 shape;
    vec2 clip;
    vec2 scale;
    float line_width;
    bool premultiply;
    vec2 blur;
    vec4 source;
    vec2 start_pt;
    vec2 last_pt;
    int source_blend;
    bool has_clip;
};

// save current stroke width, starting
// point and blend mode from active context.
Context save();
// restore stroke width, starting point
// and blend mode to a context previously returned by save()
void restore(Context ctx);

// draws a half-transparent debug gradient for the
// active path
void debug_gradient();
void debug_clip_gradient();
// returns the gradient epsilon width
float get_gradient_eps();

// your draw calls here
//////////////////////////////////////////////////////////

#define HASHSCALE3 vec3(443.897, 441.423, 437.195)
///  2 out, 2 in...
vec2 hash22(vec2 p)
{
	vec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);
    p3 += dot(p3, p3.yzx+19.19);
    return fract((p3.xx+p3.yz)*p3.zy);

}

vec3 C;
float testf(float x) {
    return (C[0] + C[1]*x + C[2]*x*x)*coeff_scale;
}

const float CR = 0.012;
void paint_zenith(poly2 g0, float x) {
    set_source_rgb(1.0,0.5,0.0);
    float g0x = -g0.a[1] / (2.0*g0.a[2]);
    float g0y = pa_f(g0.a, g0x).x;
    if (g0x >= 0.0 && g0x < 1.0)
        circle(x,g0y*coeff_scale,CR);
    float t0 = pa_f(g0.a, 0.0).x;
    float t1 = pa_f(g0.a, 1.0).x;
    circle(x,t0*coeff_scale,CR);
    circle(x,t1*coeff_scale,CR);
    fill();
}

#define NUM_STEPS_H 16
#define NUM_STEPS_V 16
void paint() {
    setup();
    set_source_rgb(vec3(1.0));
    clear();
    translate(-0.5,-0.8);

#if 1
    float d = fieldf(get_origin());
    float q = clamp(log2(abs(d))/8.0,0.0,1.0);
    //set_source_rgb(hsl(d,mix(1.0,0.0,q),mix(0.5,1.0,q)*mix(0.7,1.0,sign(d)*0.5+0.5)  ));
    set_source_rgb(hsl(d,1.0,mix(0.3,0.5,float(d > 0.0))));
    graph2D(fieldf);
    clear();
    set_line_width_px(1.0);
    set_source_rgba(0.0,0.0,0.0,1.0);
	stroke();

    set_line_width_px(1.0);
    set_source_rgba(0.0,0.0,0.0,1.0);
	rectangle(0.0,0.0,1.0,1.0);
	stroke();
#endif
#if 1
    set_line_width_px(1.0);
    set_source_rgba(0.0,0.0,0.0,1.0);
    vec2 st = 1.0/vec2(NUM_STEPS_V, NUM_STEPS_H);
    for (int k = 0; k < NUM_STEPS_V; ++k) {
        for (int i = 0; i < NUM_STEPS_H; ++i) {
	        float s = float(k) * st.x;
            float t = float(i) * st.y;
			vec2 h = hash22(get_origin() + vec2(s,t) + mod(iTime,1.0)) * st;
            prepare_ray(s + h.x,t + h.y);
            graph1D(rayf);
            stroke();
        }
    }
#endif

#if 1

    set_line_width_px(1.3);
    
    float t = get_origin().x;
    float tk = 1.0/32.0;
    t -= mod(t - 0.5*tk, tk);
    t += 0.5*tk;
    float dt = 1.0 / 32.0;
    interval q0 = bound_slice(t);
    interval q1 = bound_slice(t + dt);
    interval q2 = bound_slice(t - dt);

    #if 0
    float d0 = (q1.i0 - q2.i0) / (2.0 * dt);
    float d1 = (q1.i1 - q2.i1) / (2.0 * dt);
    float fa0 = (q0.i0 - q2.i0) / dt;
    float fa1 = (q0.i1 - q2.i1) / dt;
    float fb0 = (q1.i0 - q0.i0) / dt;
    float fb1 = (q1.i1 - q0.i1) / dt;
    float f0 = (fb0 - fa0) / (2.0*dt);
    float f1 = (fb1 - fa1) / (2.0*dt);
    set_source_rgb(vec3(0.0,0.5,1.0));
    float ddt = 0.05;
    move_to(t - ddt, q0.i0*coeff_scale - d0*coeff_scale*ddt);
    line_to(t + ddt, q0.i0*coeff_scale + d0*coeff_scale*ddt);
    stroke();
    move_to(t - ddt, q0.i1*coeff_scale - d1*coeff_scale*ddt);
    line_to(t + ddt, q0.i1*coeff_scale + d1*coeff_scale*ddt);
    stroke();
    set_source_rgb(vec3(1.0,0.0,0.0));
    if ((i > 0) && (d0 < 0.0)) {
        float z = solve_quadratic0(vec3(q0.i0, d0, f0));
        if (z != z) {
            z = -(2.0*q0.i0) / d0;
        }
        move_to(t, q0.i0*coeff_scale);
        line_to(t + z, 0.0);
        stroke();
        circle(t + z, 0.0, CR);
        fill();
    }
    #endif
    if ((q0.i0 >= 0.0) && (q0.i1 > 0.0))
        set_source_rgb(vec3(0.0,0.5,1.0));
    else if ((q0.i0 < 0.0) && (q0.i1 <= 0.0))
        set_source_rgb(vec3(0.0,1.0,0.5));
        else
            set_source_rgb(vec3(1.0,0.5,0.0));
        circle(t, q0.i0*coeff_scale, CR);
    circle(t, q0.i1*coeff_scale, CR);
    fill();
    move_to(t, q0.i0*coeff_scale);
    line_to(t, q0.i1*coeff_scale);
    stroke();
    
    set_line_width_px(1.0);
#endif

#if 0
    set_source_rgba(0.0,0.0,0.0,0.3);
    move_to(0.0,0.0);
    line_to(1.0,0.0);
    move_to(0.0,-1.0);
    line_to(0.0,1.0);
    move_to(0.25,-1.0);
    line_to(0.25,1.0);
    move_to(0.5,-1.0);
    line_to(0.5,1.0);
    move_to(0.75,-1.0);
    line_to(0.75,1.0);
    move_to(1.0,-1.0);
    line_to(1.0,1.0);
    stroke();
#endif
}

// implementation
//////////////////////////////////////////////////////////

vec2 aspect;
vec2 uv;
vec2 position;
vec2 query_position;
float ScreenH;
float AA;
float AAINV;

//////////////////////////////////////////////////////////

float det(vec2 a, vec2 b) { return a.x*b.y-b.x*a.y; }

//////////////////////////////////////////////////////////

vec3 hue(float hue) {
    return clamp(
        abs(mod(hue * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
        0.0, 1.0);
}

vec3 hsl(float h, float s, float l) {
    vec3 rgb = hue(h);
    return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
}

vec4 hsl(float h, float s, float l, float a) {
    return vec4(hsl(h,s,l),a);
}

//////////////////////////////////////////////////////////

#define DEFAULT_SHAPE_V 1e+20
#define DEFAULT_CLIP_V -1e+20

Context _stack;

void init (vec2 fragCoord) {
    uv = fragCoord.xy / iResolution.xy;
    vec2 m = iMouse.xy / iResolution.xy;

    position = (uv*2.0-1.0)*aspect;
    query_position = (m*2.0-1.0)*aspect;

    _stack = Context(
        vec4(position, query_position),
        vec2(DEFAULT_SHAPE_V),
        vec2(DEFAULT_CLIP_V),
        vec2(1.0),
        1.0,
        false,
        vec2(0.0,1.0),
        vec4(vec3(0.0),1.0),
        vec2(0.0),
        vec2(0.0),
        Replace,
        false
    );
}

vec3 _color = vec3(1.0);

vec2 get_origin() {
    return _stack.position.xy;
}

vec2 get_query() {
    return _stack.position.zw;
}

void set_query(vec2 p) {
    _stack.position.zw = p;
    _stack.shape.y = DEFAULT_SHAPE_V;
    _stack.clip.y = DEFAULT_CLIP_V;
}

Context save() {
    return _stack;
}

void restore(Context ctx) {
    // preserve shape
    vec2 shape = _stack.shape;
    vec2 clip = _stack.clip;
    bool has_clip = _stack.has_clip;
    // preserve source
    vec4 source = _stack.source;
    _stack = ctx;
    _stack.shape = shape;
    _stack.clip = clip;
    _stack.source = source;
    _stack.has_clip = has_clip;
}

mat3 mat2x3_invert(mat3 s)
{
    float d = det(s[0].xy,s[1].xy);
    d = (d != 0.0)?(1.0 / d):d;

    return mat3(
        s[1].y*d, -s[0].y*d, 0.0,
        -s[1].x*d, s[0].x*d, 0.0,
        det(s[1].xy,s[2].xy)*d,
        det(s[2].xy,s[0].xy)*d,
        1.0);
}

void identity_matrix() {
    _stack.position = vec4(position, query_position);
    _stack.scale = vec2(1.0);
}

void set_matrix(mat3 mtx) {
    mtx = mat2x3_invert(mtx);
    _stack.position.xy = (mtx * vec3(position,1.0)).xy;
    _stack.position.zw = (mtx * vec3(query_position,1.0)).xy;
    _stack.scale = vec2(length(mtx[0].xy), length(mtx[1].xy));
}

void transform(mat3 mtx) {
    mtx = mat2x3_invert(mtx);
    _stack.position.xy = (mtx * vec3(_stack.position.xy,1.0)).xy;
    _stack.position.zw = (mtx * vec3(_stack.position.zw,1.0)).xy;
    _stack.scale *= vec2(length(mtx[0].xy), length(mtx[1].xy));
}

void rotate(float a) {
    float cs = cos(a), sn = sin(a);
    transform(mat3(
        cs, sn, 0.0,
        -sn, cs, 0.0,
        0.0, 0.0, 1.0));
}

void scale(vec2 s) {
    transform(mat3(s.x,0.0,0.0,0.0,s.y,0.0,0.0,0.0,1.0));
}

void scale(float sx, float sy) {
    scale(vec2(sx, sy));
}

void scale(float s) {
    scale(vec2(s));
}

void translate(vec2 p) {
    transform(mat3(1.0,0.0,0.0,0.0,1.0,0.0,p.x,p.y,1.0));
}

void translate(float x, float y) { translate(vec2(x,y)); }

void clear() {
    _color = mix(_color, _stack.source.rgb, _stack.source.a);
}

void blit(out vec4 dest) {
    dest = vec4(_color, 1.0);
}

void blit(out vec3 dest) {
    dest = _color;
}

void add_clip(vec2 d) {
    d = d / _stack.scale;
    _stack.clip = max(_stack.clip, d);
    _stack.has_clip = true;
}

void add_field(vec2 d) {
    d = d / _stack.scale;
    _stack.shape = min(_stack.shape, d);
}

void add_field(float c) {
    _stack.shape.x = min(_stack.shape.x, c);
}

void new_path() {
    _stack.shape = vec2(DEFAULT_SHAPE_V);
    _stack.clip = vec2(DEFAULT_CLIP_V);
    _stack.has_clip = false;
}

void debug_gradient() {
    vec2 d = _stack.shape;
    _color = mix(_color,
        hsl(d.x * 6.0,
            1.0, (d.x>=0.0)?0.5:0.3),
        0.5);
}

void debug_clip_gradient() {
    vec2 d = _stack.clip;
    _color = mix(_color,
        hsl(d.x * 6.0,
            1.0, (d.x>=0.0)?0.5:0.3),
        0.5);
}

void set_blur(float b) {
    if (b == 0.0) {
        _stack.blur = vec2(0.0, 1.0);
    } else {
        _stack.blur = vec2(
            b,
            0.0);
    }
}

void write_color(vec4 rgba, float w) {
    float src_a = w * rgba.a;
    float dst_a = _stack.premultiply?w:src_a;
    _color = _color * (1.0 - src_a) + rgba.rgb * dst_a;
}

void premultiply_alpha(bool enable) {
    _stack.premultiply = enable;
}

float min_uniform_scale() {
    return min(_stack.scale.x, _stack.scale.y);
}

float uniform_scale_for_aa() {
    return min(1.0, _stack.scale.x / _stack.scale.y);
}

float calc_aa_blur(float w) {
    vec2 blur = _stack.blur;
    w -= blur.x;
    float wa = clamp(-w*AA*uniform_scale_for_aa(), 0.0, 1.0);
    float wb = clamp(-w / blur.x + blur.y, 0.0, 1.0);
	return wa * wb;
}

void fill_preserve() {
    write_color(_stack.source, calc_aa_blur(_stack.shape.x));
    if (_stack.has_clip) {
	    write_color(_stack.source, calc_aa_blur(_stack.clip.x));
    }
}

void fill() {
    fill_preserve();
    new_path();
}

void set_line_width(float w) {
    _stack.line_width = w;
}

void set_line_width_px(float w) {
    _stack.line_width = w*min_uniform_scale() * AAINV;
}

float get_gradient_eps() {
    return (1.0 / min_uniform_scale()) * AAINV;
}

vec2 stroke_shape() {
    return abs(_stack.shape) - _stack.line_width/_stack.scale;
}

void stroke_preserve() {
    float w = stroke_shape().x;
    write_color(_stack.source, calc_aa_blur(w));
}

void stroke() {
    stroke_preserve();
    new_path();
}

bool in_fill() {
    return (_stack.shape.y <= 0.0);
}

bool in_stroke() {
    float w = stroke_shape().y;
    return (w <= 0.0);
}

void set_source_rgba(vec4 c) {
    if (_stack.source_blend == Multiply) {
        _stack.source *= c;
    } else if (_stack.source_blend == Alpha) {
    	float src_a = c.a;
    	float dst_a = _stack.premultiply?1.0:src_a;
	    _stack.source =
            vec4(_stack.source.rgb * (1.0 - src_a) + c.rgb * dst_a,
                 max(_stack.source.a, c.a));
    } else {
    	_stack.source = c;
    }
}

void set_source_rgba(float r, float g, float b, float a) {
    set_source_rgba(vec4(r,g,b,a)); }

void set_source_rgb(vec3 c) {
    set_source_rgba(vec4(c,1.0));
}

void set_source_rgb(float r, float g, float b) { set_source_rgb(vec3(r,g,b)); }

void set_source(sampler2D image) {
    set_source_rgba(texture(image, _stack.position.xy));
}

void set_source_linear_gradient(vec4 color0, vec4 color1, vec2 p0, vec2 p1) {
    vec2 pa = _stack.position.xy - p0;
    vec2 ba = p1 - p0;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    set_source_rgba(mix(color0, color1, h));
}

void set_source_linear_gradient(vec3 color0, vec3 color1, vec2 p0, vec2 p1) {
    set_source_linear_gradient(vec4(color0, 1.0), vec4(color1, 1.0), p0, p1);
}

void set_source_radial_gradient(vec4 color0, vec4 color1, vec2 p, float r) {
    float h = clamp( length(_stack.position.xy - p) / r, 0.0, 1.0 );
    set_source_rgba(mix(color0, color1, h));
}

void set_source_radial_gradient(vec3 color0, vec3 color1, vec2 p, float r) {
    set_source_radial_gradient(vec4(color0, 1.0), vec4(color1, 1.0), p, r);
}

void set_source_blend_mode(int mode) {
    _stack.source_blend = mode;
}

vec2 length2(vec4 a) {
    return vec2(length(a.xy),length(a.zw));
}

vec2 dot2(vec4 a, vec2 b) {
    return vec2(dot(a.xy,b),dot(a.zw,b));
}

void rounded_rectangle(vec2 o, vec2 s, float r) {
    s = (s * 0.5);
    r = min(r, min(s.x, s.y));
    o += s;
    s -= r;
    vec4 d = abs(o.xyxy - _stack.position) - s.xyxy;
    vec4 dmin = min(d,0.0);
    vec4 dmax = max(d,0.0);
    vec2 df = max(dmin.xz, dmin.yw) + length2(dmax);
    add_field(df - r);
}

void rounded_rectangle(float ox, float oy, float sx, float sy, float r) {
    rounded_rectangle(vec2(ox,oy), vec2(sx,sy), r);
}

void rectangle(vec2 o, vec2 s) {
    rounded_rectangle(o, s, 0.0);
}

void rectangle(float ox, float oy, float sx, float sy) {
    rounded_rectangle(vec2(ox,oy), vec2(sx,sy), 0.0);
}

void circle(vec2 p, float r) {
    vec4 c = _stack.position - p.xyxy;
    add_field(vec2(length(c.xy),length(c.zw)) - r);
}
void circle(float x, float y, float r) { circle(vec2(x,y),r); }

// from https://www.shadertoy.com/view/4sS3zz
float sdEllipse( vec2 p, in vec2 ab )
{
	p = abs( p ); if( p.x > p.y ){ p=p.yx; ab=ab.yx; }

	float l = ab.y*ab.y - ab.x*ab.x;
    if (l == 0.0) {
        return length(p) - ab.x;
    }

    float m = ab.x*p.x/l;
	float n = ab.y*p.y/l;
	float m2 = m*m;
	float n2 = n*n;

    float c = (m2 + n2 - 1.0)/3.0;
	float c3 = c*c*c;

    float q = c3 + m2*n2*2.0;
    float d = c3 + m2*n2;
    float g = m + m*n2;

    float co;

    if( d<0.0 )
    {
        float p = acos(q/c3)/3.0;
        float s = cos(p);
        float t = sin(p)*sqrt(3.0);
        float rx = sqrt( -c*(s + t + 2.0) + m2 );
        float ry = sqrt( -c*(s - t + 2.0) + m2 );
        co = ( ry + sign(l)*rx + abs(g)/(rx*ry) - m)/2.0;
    }
    else
    {
        float h = 2.0*m*n*sqrt( d );
        float s = sign(q+h)*pow( abs(q+h), 1.0/3.0 );
        float u = sign(q-h)*pow( abs(q-h), 1.0/3.0 );
        float rx = -s - u - c*4.0 + 2.0*m2;
        float ry = (s - u)*sqrt(3.0);
        float rm = sqrt( rx*rx + ry*ry );
        float p = ry/sqrt(rm-rx);
        co = (p + 2.0*g/rm - m)/2.0;
    }

    float si = sqrt( 1.0 - co*co );

    vec2 r = vec2( ab.x*co, ab.y*si );

    return length(r - p ) * sign(p.y-r.y);
}

void ellipse(vec2 p, vec2 r) {
    vec4 c = _stack.position - p.xyxy;
    add_field(vec2(sdEllipse(c.xy, r), sdEllipse(c.zw, r)));
}

void ellipse(float x, float y, float rw, float rh) {
    ellipse(vec2(x,y), vec2(rw, rh));
}

void move_to(vec2 p) {
    _stack.start_pt = p;
    _stack.last_pt = p;
}

void move_to(float x, float y) { move_to(vec2(x,y)); }

// stroke only
void line_to(vec2 p) {
    vec4 pa = _stack.position - _stack.last_pt.xyxy;
    vec2 ba = p - _stack.last_pt;
    vec2 h = clamp(dot2(pa, ba)/dot(ba,ba), 0.0, 1.0);
    vec2 s = sign(pa.xz*ba.y-pa.yw*ba.x);
    vec2 d = length2(pa - ba.xyxy*h.xxyy);
    add_field(d);
    add_clip(d * s);
    _stack.last_pt = p;
}

void line_to(float x, float y) { line_to(vec2(x,y)); }

void close_path() {
    line_to(_stack.start_pt);
}

// from https://www.shadertoy.com/view/ltXSDB

// Test if point p crosses line (a, b), returns sign of result
float test_cross(vec2 a, vec2 b, vec2 p) {
    return sign((b.y-a.y) * (p.x-a.x) - (b.x-a.x) * (p.y-a.y));
}

// Determine which side we're on (using barycentric parameterization)
float bezier_sign(vec2 A, vec2 B, vec2 C, vec2 p) {
    vec2 a = C - A, b = B - A, c = p - A;
    vec2 bary = vec2(c.x*b.y-b.x*c.y,a.x*c.y-c.x*a.y) / (a.x*b.y-b.x*a.y);
    vec2 d = vec2(bary.y * 0.5, 0.0) + 1.0 - bary.x - bary.y;
    return mix(sign(d.x * d.x - d.y), mix(-1.0, 1.0,
        step(test_cross(A, B, p) * test_cross(B, C, p), 0.0)),
        step((d.x - d.y), 0.0)) * test_cross(A, C, B);
}

// Solve cubic equation for roots
vec3 bezier_solve(float a, float b, float c) {
    float p = b - a*a / 3.0, p3 = p*p*p;
    float q = a * (2.0*a*a - 9.0*b) / 27.0 + c;
    float d = q*q + 4.0*p3 / 27.0;
    float offset = -a / 3.0;
    if(d >= 0.0) {
        float z = sqrt(d);
        vec2 x = (vec2(z, -z) - q) / 2.0;
        vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
        return vec3(offset + uv.x + uv.y);
    }
    float v = acos(-sqrt(-27.0 / p3) * q / 2.0) / 3.0;
    float m = cos(v), n = sin(v)*1.732050808;
    return vec3(m + m, -n - m, n - m) * sqrt(-p / 3.0) + offset;
}

// Find the signed distance from a point to a quadratic bezier curve
float bezier(vec2 A, vec2 B, vec2 C, vec2 p)
{
    B = mix(B + vec2(1e-4), B, abs(sign(B * 2.0 - A - C)));
    vec2 a = B - A, b = A - B * 2.0 + C, c = a * 2.0, d = A - p;
    vec3 k = vec3(3.*dot(a,b),2.*dot(a,a)+dot(d,b),dot(d,a)) / dot(b,b);
    vec3 t = clamp(bezier_solve(k.x, k.y, k.z), 0.0, 1.0);
    vec2 pos = A + (c + b*t.x)*t.x;
    float dis = length(pos - p);
    pos = A + (c + b*t.y)*t.y;
    dis = min(dis, length(pos - p));
    pos = A + (c + b*t.z)*t.z;
    dis = min(dis, length(pos - p));
    return dis * bezier_sign(A, B, C, p);
}

void curve_to(vec2 b1, vec2 b2) {
    vec2 shape = vec2(
        bezier(_stack.last_pt, b1, b2, _stack.position.xy),
        bezier(_stack.last_pt, b1, b2, _stack.position.zw));
    add_field(abs(shape));
    add_clip(shape);
	_stack.last_pt = b2;
}

void curve_to(float b1x, float b1y, float b2x, float b2y) {
    curve_to(vec2(b1x,b1y),vec2(b2x,b2y));
}

void graph(vec2 p, float f_x, float df_x) {
    add_field(abs(f_x - p.y) / sqrt(1.0 + (df_x * df_x)));
}

void graph(vec2 p, float f_x, vec2 df_x) {
    add_field(abs(f_x) / length(df_x));
}

//////////////////////////////////////////////////////////

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	 aspect = vec2(iResolution.x / iResolution.y, 1.0);
	 ScreenH = min(iResolution.x,iResolution.y);
	 AA = ScreenH*0.4;
	 AAINV = 1.0 / AA;

    init(fragCoord);

    paint();

    blit(fragColor);
}

#ifdef GLSLSANDBOX
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
#endif
