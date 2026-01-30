/*
 * Original shader from: https://www.shadertoy.com/view/wdByR1
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4  iMouse = vec4(0.0);

// --------[ Original ShaderToy begins here ]---------- //
/*
Visualization of the Hessian of an elliptic curve.
The Hessian is the set of points where the
determinant of the Hessian Matrix of the curve vanishes.
It has the interesting property that it passes through all
the inflection points of the curve.

(An inflection point is a point on the curve where the
curve tangent is intersecting the curve with multiplicity >=3)

The blue curve is the elliptic curve
The cyan curve is the Hessian of the elliptic curve
The red dots are the inflection points
The green lines are the tangents at the inflection points

Move mouse to change curve parameters

For some curve parameters the iterative computation of the
inflection points fails.

see https://en.wikipedia.org/wiki/Polar_curve#The_Hessian
*/

const int grad_descent_iterations=16;

vec2 p0=vec2(0.2,0.5);//initial approximation of the first inflection point
vec2 p1=vec2(0.2,-0.5);//initial approximation of the second inflection point

float border;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
	float aspect_ratio = iResolution.x / iResolution.y;

	vec2 uv = fragCoord.xy / iResolution.xy;
	uv-=.5;
	uv.x *= aspect_ratio;

	vec2 mouse = (iMouse.xy+1.) / iResolution.xy;
	mouse-=.5;

	const float line_width = .001;
	const float curve_width = .001;
	const float dot_size = .005;

	const float axis_width = .005;

	const vec3 bg_col = vec3(1,1,1);
	const vec3 axis_col = vec3(0,0,0);
	const vec3 line_col = vec3(0,1,0);
	const vec3 curve_col = vec3(0,0,1);
	const vec3 hesse_curve_col = vec3(0,1,1);
	const vec3 dot_col = vec3(1,0,0);

    border = 2./iResolution.y;

	float curve_dis = 1e38;
	float hesse_curve_dis = 1e38;
	float dot_dis = 1e38;
	float axis_dis = 1e38;
	float line_dis = 1e38;

	//elliptic curve parameters (weierstrass normal form)

	float g_2, g_3;

	if(iMouse.x > 0.0){
		g_2 = .3+mouse.x;
		g_3 = -.05+.1*mouse.y;
	}
	else{
		g_2 = .3;
		g_3 = -.05;
	}

	//compute points lying exactly on the curve by gradient descent
	//compute inflection points by alternately gradient descenting to curve and hessian of curve
	float p0_val, hesse_p0_val, p1_val, hesse_p1_val;
	vec2 p0_grad, hesse_p0_grad, p1_grad, hesse_p1_grad;

	for(int i=0;i<grad_descent_iterations;i++){
		p0_val = p0.y*p0.y - (( 4.*p0.x*p0.x - g_2 ) * p0.x - g_3);
		p0_grad = vec2(-12.*p0.x*p0.x+g_2,2.*p0.y);
		p0-=(p0_grad*p0_val)/dot(p0_grad,p0_grad);

		hesse_p0_val = -96.*g_2*p0.x*p0.x + 96.*p0.x*p0.y*p0.y - 8.*g_2*g_2 - 288.*g_3*p0.x;
		hesse_p0_grad = vec2(-192.*g_2*p0.x + 96.*p0.y*p0.y - 288.*g_3,192.*p0.x*p0.y);
		p0-=(hesse_p0_grad*hesse_p0_val)/dot(hesse_p0_grad,hesse_p0_grad);

		p1_val = p1.y*p1.y - (( 4.*p1.x*p1.x - g_2 ) * p1.x - g_3);
		p1_grad = vec2(-12.*p1.x*p1.x+g_2,2.*p1.y);
		p1-=(p1_grad*p1_val)/dot(p1_grad,p1_grad);

		hesse_p1_val = -96.*g_2*p1.x*p1.x + 96.*p1.x*p1.y*p1.y - 8.*g_2*g_2 - 288.*g_3*p1.x;
		hesse_p1_grad = vec2(-192.*g_2*p1.x + 96.*p1.y*p1.y - 288.*g_3,192.*p1.x*p1.y);
		p1-=(hesse_p1_grad*hesse_p1_val)/dot(hesse_p1_grad,hesse_p1_grad);
	}

	dot_dis=min(dot_dis,distance(p0,uv)-dot_size);
	dot_dis=min(dot_dis,distance(p1,uv)-dot_size);

	p0_grad = vec2(-12.*p0.x*p0.x+g_2,2.*p0.y);
	vec3 tangent1=vec3(normalize(p0_grad),0);
	tangent1.z=-dot(p0,tangent1.xy);

	line_dis=min(line_dis,abs(dot(vec3(uv,1),tangent1)));

	p1_grad = vec2(-12.*p1.x*p1.x+g_2,2.*p1.y);
	vec3 tangent2=vec3(normalize(p1_grad),0);
	tangent2.z=-dot(p1,tangent2.xy);

	line_dis=min(line_dis,abs(dot(vec3(uv,1),tangent2)));

	float uv_val = uv.y*uv.y - (( 4.*uv.x*uv.x - g_2 ) * uv.x - g_3);
	vec2 uv_grad = vec2(-12.*uv.x*uv.x+g_2,2.*uv.y);

	curve_dis=min(curve_dis, abs(uv_val)/length(uv_grad)-curve_width);

	float hesse_uv_val = -96.*g_2*uv.x*uv.x + 96.*uv.x*uv.y*uv.y - 8.*g_2*g_2 - 288.*g_3*uv.x;
	vec2 hesse_uv_grad = vec2(-192.*g_2*uv.x + 96.*uv.y*uv.y - 288.*g_3,192.*uv.x*uv.y);

	hesse_curve_dis=min(hesse_curve_dis, abs(hesse_uv_val)/length(hesse_uv_grad)-curve_width);

	axis_dis=min(axis_dis, abs(uv.x));
	axis_dis=min(axis_dis, abs(uv.y));

	vec3 color = bg_col;

	color=vec3(mix(axis_col,color,smoothstep(0., border, axis_dis)));
	color=vec3(mix(line_col,color,smoothstep(0., border, line_dis)));
	color=vec3(mix(hesse_curve_col,color,smoothstep(0., border, hesse_curve_dis)));
	color=vec3(mix(curve_col,color,smoothstep(0., border, curve_dis)));
	color=vec3(mix(dot_col,color,smoothstep(0., border, dot_dis)));

	fragColor = vec4(color,1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 0.0, 0.0);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}