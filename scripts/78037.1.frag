#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926

// Integrator settings:
const int MAX_IT = 8000;
const float MAX_DT = 16.0;
const float MAX_TRUNC = 1e-4;
const float MIN_TRUNC = 1e-6;

// Position of the Observer:
const float rObs0 = 1000.0; // [M]
const float thetaObs0 = radians(85.0); 
const float phiObs0 = radians(0.0);

// Observers screen space: 
const float width = (30.0) * 2.0; 	// celestial width in [M]
const float hight = 9.0 / 16.0 * width; // celestial hight in [M]

// Kerr Black Hole constants:
const float M = 1.0;
const float a = 0.0; // Dummy

// Thin disc accretion radii:
const float r_accretio_max = 25.0;
const float r_accretio_min = 6.0;

// Defining the Schwarzschild-Metric and its inverse:
mat4 calc_g(vec4 q)
{
	mat4 g;
	g[0][0] = - (1.0 - 2.0 * M / q[1]);
	g[1][1] = + 1.0 / (1.0 - 2.0 * M / q[1]);
	g[2][2] = + q[1] * q[1];
	g[3][3] = + q[1] * q[1] * sin(q[2]) * sin(q[2]);
	return g;
}
mat4 calc_g_inv(vec4 q)
{
	mat4 g_inv;
	g_inv[0][0] = - 1.0 / (1.0 - 2.0 * M / q[1]);
	g_inv[1][1] = + 1.0 - 2.0 * M / q[1];
	g_inv[2][2] = + 1.0 / (q[1] * q[1]);
	g_inv[3][3] = + 1.0 / (q[1] * q[1] * sin(q[2]) * sin(q[2]));
	return g_inv;
}

// Defining the set of coupled ODEs we have to solve:
vec4 ODE_dqdt(float dt, vec4 q, vec4 p)
{
	return calc_g_inv(q) * p;
}
vec4 ODE_dpdt(float dt, vec4 q, vec4 p)
{
	vec4 dpdt;
	float epsilon = 0.012 * dt; // 0.012 is a solid choice
	for (int k = 1; k < 3; k++) // E and L_z are conserved!
	{
		vec4 h;
		h[k] = epsilon;
		
		mat4 g_inv_p = calc_g_inv(q + h);
		mat4 g_inv_m = calc_g_inv(q - h);
		for (int i = 0; i < 4; i++)
		{
			for (int j = 0; j < 4; j++)
			{
				float dig_ij = (g_inv_p[i][j] - g_inv_m[i][j]) / (2.0 * epsilon);
				dpdt[k] -= 1.0 / 2.0 * dig_ij * p[i] * p[j];
			}
		}	
	}
	return dpdt;
}

// Calculate the initial conditions of a photon:
void init_cond(float x, float y, inout vec4 q, inout vec4 p, inout vec4 qOld)
{
	float rObs = rObs0;
	float thetaObs = thetaObs0 - 0.1 * mouse.y;
	float phiObs = phiObs0;
	
	float D = sin(thetaObs) * sqrt(rObs * rObs + a * a) - y * cos(thetaObs);
	float X = D * cos(phiObs) - x * sin(phiObs);
	float Y = D * sin(phiObs) + x * cos(phiObs);
	float Z = rObs * cos(thetaObs) + y * sin(thetaObs);
	float sigma = (X * X + Y * Y + Z * Z - a * a) / 2.0;

	// Calculating the initial 4-position:
	float r0 = sqrt(sigma + sqrt(sigma * sigma + a * a * Z * Z));
	float theta0 = acos(Z / r0);
	float phi0 = atan(Y, X);
	q = vec4(0.0, r0, theta0, phi0);

	float SIGMA = r0 * r0 + a * a * cos(theta0) * cos(theta0);
	float R = sqrt(r0 * r0 + a * a);
	float PHI = phi0 - phiObs;

	// Computing the initial 3-vecolity:
	float u_r = (r0 * R * sin(theta0) * sin(thetaObs) * cos(PHI) + R * R * cos(theta0) * cos(thetaObs)) / SIGMA;
	float u_theta = (R * cos(theta0) * sin(thetaObs) * cos(PHI) - r0 * sin(theta0) * cos(thetaObs)) / SIGMA;
	float u_phi = ((sin(thetaObs) / sin(theta0)) * sin(PHI)) / R;
	vec4 u = vec4(0.0, u_r, u_theta, u_phi);

	// Computing the u_t component to fulfill the null geodesic constraint:
	mat4 g = calc_g(q);
	float beta = 0.0, gamma = 0.0;
	for (int i = 1; i < 4; i++)
	{
		beta += (g[0][i] * u[i]) / (g[0][0]);
		for (int j = 1; j < 4; j++)
		{
			gamma += (g[i][j] * u[i] * u[j]) / (g[0][0]);
		}
	}
	u[0] = -beta - sqrt(beta * beta - gamma);

	// Computing the 4-momentum out of the 4-velocity:
	p = g * u;
	
	// Keeping track of the previous position:
	qOld = q;
}

// Fifth order Fehlberg integrator with variable stepsize:
void RKF45(inout float dt, inout vec4 q, inout vec4 p, inout vec4 qOld)
{
	vec4 k1, l1;
	vec4 k2, l2;
	vec4 k3, l3;
	vec4 k4, l4;
	vec4 k5, l5;
	vec4 k6, l6;
	
	for (int i = 0; i < 3; i++)
	{
		k1 = dt * ODE_dqdt(dt, q, p);
		l1 = dt * ODE_dpdt(dt, q, p);
		k2 = dt * ODE_dqdt(dt, q - (+1.0 / 4.0 * k1), p - (+1.0 / 4.0 * l1));
		l2 = dt * ODE_dpdt(dt, q - (+1.0 / 4.0 * k1), p - (+1.0 / 4.0 * l1));
		k3 = dt * ODE_dqdt(dt, q - (+3.0 / 32.0 * k1 + 9.0 / 32.0 * k2), p - (+3.0 / 32.0 * l1 + 9.0 / 32.0 * l2));
		l3 = dt * ODE_dpdt(dt, q - (+3.0 / 32.0 * k1 + 9.0 / 32.0 * k2), p - (+3.0 / 32.0 * l1 + 9.0 / 32.0 * l2));
		k4 = dt * ODE_dqdt(dt, q - (+1932.0 / 2197.0 * k1 - 7200.0 / 2197.0 * k2 + 7296.0 / 2197.0 * k3), p - (+1932.0 / 2197.0 * l1 - 7200.0 / 2197.0 * l2 + 7296.0 / 2197.0 * l3));
		l4 = dt * ODE_dpdt(dt, q - (+1932.0 / 2197.0 * k1 - 7200.0 / 2197.0 * k2 + 7296.0 / 2197.0 * k3), p - (+1932.0 / 2197.0 * l1 - 7200.0 / 2197.0 * l2 + 7296.0 / 2197.0 * l3));
		k5 = dt * ODE_dqdt(dt, q - (+439.0 / 216.0 * k1 - 8.0 * k2 + 3680.0 / 513.0 * k3 - 845.0 / 4104.0 * k4), p - (+439.0 / 216.0 * l1 - 8.0 * l2 + 3680.0 / 513.0 * l3 - 845.0 / 4104.0 * l4));
		l5 = dt * ODE_dpdt(dt, q - (+439.0 / 216.0 * k1 - 8.0 * k2 + 3680.0 / 513.0 * k3 - 845.0 / 4104.0 * k4), p - (+439.0 / 216.0 * l1 - 8.0 * l2 + 3680.0 / 513.0 * l3 - 845.0 / 4104.0 * l4));
		k6 = dt * ODE_dqdt(dt, q - (-8.0 / 27.0 * k1 + 2.0 * k2 - 3544.0 / 2565.0 * k3 + 1859.0 / 4104.0 * k4 - 11.0 / 40.0 * k5), p - (-8.0 / 27.0 * l1 + 2.0 * l2 - 3544.0 / 2565.0 * l3 + 1859.0 / 4104.0 * l4 - 11.0 / 40.0 * l5));
		l6 = dt * ODE_dpdt(dt, q - (-8.0 / 27.0 * k1 + 2.0 * k2 - 3544.0 / 2565.0 * k3 + 1859.0 / 4104.0 * k4 - 11.0 / 40.0 * k5), p - (-8.0 / 27.0 * l1 + 2.0 * l2 - 3544.0 / 2565.0 * l3 + 1859.0 / 4104.0 * l4 - 11.0 / 40.0 * l5));
		
		vec4 dq_O5 = 16.0 / 135.0 * k1 + 6656.0 / 12825.0 * k3 + 28561.0 / 56430.0 * k4 - 9.0 / 50.0 * k5 + 2.0 / 55.0 * k6;
		vec4 dp_O5 = 16.0 / 135.0 * l1 + 6656.0 / 12825.0 * l3 + 28561.0 / 56430.0 * l4 - 9.0 / 50.0 * l5 + 2.0 / 55.0 * l6;
		vec4 dp_O4 = 25.0 / 216.0 * l1 + 1408.0 / 2565.0 * l3 + 2197.0 / 4101.0 * l4 - 1.0 / 5.0 * l5;
		
		// Note: E and L_z are conserved
		float TE = 0.9 * (abs(dp_O5[1] - dp_O4[1]) + abs(dp_O5[2] - dp_O4[2])) * dt; // 1-Norm
		if (TE > MAX_TRUNC)
		{
			dt *= 0.5;
			continue;
		}
		if (TE < MIN_TRUNC)
		{
			dt *= 2.0;
			if (dt > MAX_DT) dt = MAX_DT;
			qOld = q;
			q -= dq_O5;
			p -= dp_O5;
			return;
		}
		
		// Stepsize is ok:
		qOld = q;
		q -= dq_O5;
		p -= dp_O5;
		return;
	}
}

// Checks if the photon hits the accretion disc:
bool check_accretio_intersect(inout bool accretio_flag, vec4 q, vec4 p, vec4 qOld)
{	
	// The photon has not passed the xy_plane
	if ((q[2] < PI / 2.0 && accretio_flag == true) || (q[2] > PI / 2.0 && accretio_flag == false)) 
		return false;

	// The photon passed the xy plane we have to check if it hits the accretion disc:
	vec3 pos = vec3(q[1] * sin(q[2]) * cos(q[3]), 
			q[1] * sin(q[2]) * sin(q[3]), 
			q[1] * cos(q[2]));
	vec3 v = vec3(-pos[0] + qOld[1] * sin(qOld[2]) * cos(qOld[3]), 
		      -pos[1] + qOld[1] * sin(qOld[2]) * sin(qOld[3]), 
		      -pos[2] + qOld[1] * cos(qOld[2]));

	// Computing the hit with the x-y-plane:
	float tHit = -pos[2] / v[2];
	float c2 = dot(pos + tHit * v, pos + tHit * v);

	// If the photon hits the accretion disc:
	if ((c2 > r_accretio_min * r_accretio_min) && (c2 < r_accretio_max * r_accretio_max)) 
		return true; 
	
	// The photon did not hit the accretion disc:
	accretio_flag = !accretio_flag;
	return false;
}

// Terminates if the photon left the numerical domain or it got lost in the EH:
vec4 trace_ray(float x, float y)
{
	vec4 q, p, qOld;
	init_cond(x, y, q, p, qOld);
	float dt = MAX_DT;
	
	bool accretio_flag;
	if (q[2] < PI / 2.0) accretio_flag = true;
	else false;
	
	bool hit_sphere = false;
	for (int n = 0; n < MAX_IT; n++)
	{
		if (q[1] < 2.5) return vec4(0.0, 0.0, 0.0, 0.0); // Photon got lost in the shadow
		if (q[1] > rObs0 + 10.0) return vec4(0.0, 0.0, 0.0, 1.0); // Photon left the numerical domain
		
		if (q[1] < r_accretio_max && hit_sphere == false) hit_sphere = true;
		if (q[1] > r_accretio_max && hit_sphere == true ) return vec4(0.0, 0.0, 0.0, 1.0); // Photon left the boundary sphere
		
		if (check_accretio_intersect(accretio_flag, q, p, qOld)) 
			return vec4(pow(r_accretio_min / q[1], 1.5) * vec3(1.0, 1.0, 1.0), 1.0); // Photon hit the accration disc 
		
		// No termination condition hit - continuing to integrate:
		//RK12(dt, q, p, qOld);
		RKF45(dt, q, p, qOld);
	}
	
	// The photon didn't make it out in time:
	return vec4(1.0, 0.0, 0.0, 1.0);
}

void main( void ) 
{
	float x = width * (-0.5 * resolution.x + gl_FragCoord.x) / resolution.x;
	float y = hight * (-0.5 * resolution.y + gl_FragCoord.y) / resolution.y;	
	gl_FragColor = trace_ray(x, y);
}