#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int it_max = 2000;
const float max_dist = 10.;
const float eps = 0.00005;
const float j =.0000;

uniform vec2 surfaceSize;
varying vec2 surfacePosition;

struct ray {
		float occluded;
		vec3 end;
		};
	
	
	


float dist_line (vec3 pos, vec3 begin, vec3 end)
{
	vec3 a = normalize(end-begin);
	vec3 b = pos-begin;
	vec3 ba = a*dot(a,b);
	float dist = length(b-ba);
	return min(min(dist, length(pos-begin)),length(pos-end));
	
}

float line (vec3 pos, vec3 begin, vec3 end, float width)
{ return smoothstep (width, width-0.01,dist_line(pos,begin, end));
}

float dist_cylinder (vec3 pos, vec3 begin, vec3 end, float d)
{
	vec3 pb = pos-begin;
	vec3 a = end-begin;
	float ba =dot(pb,a)/dot(a,a);
	ba = clamp(ba,0.0,1.0);
	
	float dist = length(pb-a*ba)-d+eps;
	
	return dist;
	
}

float circle (vec3 pos, vec3 mid, float d)
{
	return length(pos-mid)-d;
}

float dist2_cylinder (vec3 pos, vec3 begin, vec3 end, float d)
{
	vec3 a = normalize(end-begin);
	vec3 b = pos-begin;
	vec3 ba = a*dot(a,b);
	float dist = length(b-ba)-d;
	
	if (length(ba-end+begin)>0.0)
		dist = length(pos-begin)-d;
	//dist = max(dist, length(pos-(end+begin)/2.0));
	//dist = max(dist, length(pos-end)-d);
	return dist;
	
}


float dist_plane (vec3 pos, vec3 normal, float el)
{
	vec3 n = normalize(normal);
	return dot(pos, n)-el;
}

vec3 noise (vec3 pos, float range)
{
	//return (circle(pos, pos*mod(7.0,length(pos)), circle(pos, pos*mod(10000.0,length(pos)), 0.01)), range);
	
	vec3 res = mod(mod(pos+mod(pos, vec3(range/5.3)), range/5.3), range);
	
	res.z = mix(res.x,res.y,0.5)*(pos.y*pos.x);
	res.x = 0.0;
	res.y = 0.0;
		
	return mod(pos,range);
}

float smin(float v1, float v2)
{
	float x = 0.0;//dot(v1,v2)/(v1+v2)/200.0;
	return min(v1+x, v2+x);
}

float dist (vec3 pos)
{
	float dis = 1.0/0.0;
	
	vec2 m = mouse-vec2(0.5,0.5);
	vec3 e = vec3(m,0.5);
	vec3 a = vec3(0.0,0.0,2.0);
	float dm = 0.1;
	//float n = +noise(pos)/(40.0*length(pos));
	
	dis = dist_cylinder(pos, a,e,dm );
	//dis = smin(dis,dist_cylinder(pos, a,e/4.,dm ));
	dis = smin (dis , circle(pos, vec3(0.3, 0.3,m.y+0.5),0.2));
	//dis = min (dis, circle (pos, light2, 0.1));
	
	dis = smin(dis, dist_plane(pos, vec3(0.0,1.1,-1.5),-2.0));
	
	//float disc = circle(pos,vec3(-0.2,-10.5, 1.1),10.1);
	//dis = smin(dis, disc); 
	
	//dis = min(dis, circle(pos, noise(pos,0.00001), 0.01));
	
	return dis;
	
	
	
}


vec3 getnormal (vec3 pos, float epsilon)
{
	//from http://www.letsdive.in/2014/05/18/glsl---raymarching/
	float ep = epsilon;//*length(pos*epsilon);
	
	float d0 = dist(pos);
  	float dX = dist(pos - vec3(ep, 0.0, 0.0));
 	float dY = dist(pos - vec3(0.0, ep, 0.0));
  	float dZ = dist(pos - vec3(0.0, 0.0, ep));
	
 	 return normalize(vec3(dX-d0, dY-d0, dZ-d0));	
}

float shadeFact (float SmallestDistance)
{
	return SmallestDistance;
	//return clamp(SmallestDistance*1., 0.0,1.0);
}

float shadow( vec3 light,  vec3 pos, float k )
{
    	float dmin = 1.0;
	float d = 0.0;
	
	vec3 dir = light-pos-noise(pos,j);//-mod(pos,j);
	float total_dist = length(dir);
	dir = normalize(dir);
	vec3 p = pos;
	float ep = eps*2.0;
	float l =3.1415*ep;
	
	//p+= mod(p,j);
	
	for (int i = 0; i<it_max; i++)
	{
		
		p = pos+dir*l*0.99;
		
		
		d = dist(p);
		//d = clamp(length(p-light),0.0, d);
		l+=d;
		
		dmin = min(dmin, 2.0*total_dist*d/(l));
		//dmin = min(dmin, smoothstep(0.0,12.0,5.0*total_dist*d/(l)));
		//dmin = min(dmin, 5.0*total_dist*smoothstep(10.0,0.0,d)/(l));
		//dmin = min(dmin, 5.0*total_dist*smoothstep(1.0,0.0,d)/(l));
		
		ep = eps + eps*pow(1.2,l);
		
		
		if (d < ep)
		{
			//return shadeFact(0.0);
			return shadeFact(dmin);
		} else
			if(l>= total_dist)
			{
				return shadeFact(dmin);	
			
			}
			
			
			
		
		//p += dir*d;
		
		
	}
	
    	return shadeFact(dmin);
}


		     
void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy )-vec2(0.5,0.5);
	vec2 m = mouse-vec2(0.5,0.5);
	vec3 col = vec3(0.2);
	
	//vec3 light = vec3(-0.5,1.9,-1.5);
	vec3 light = vec3(sin(time/3.+1.1415), 2.2*cos(time/3.+1.5415)+0.2, 0.0);
	vec3 light2 = vec3(0.3,0.0,1.0);
	vec3 light3 = vec3(-0.3,0.0,-0.0);
	vec3 light4 = vec3(sin(time/3.), 2.*cos(time/3.)-0.11, -0.0);
	
	//col = vec3(1.0,0.8,0.2)* line (uv, vec2(0.5,0.5),mouse, 0.01);
	
	vec3 eye = vec3(surfacePosition,-1.0);;// vec3(0.0,0.0,-1.0);
	vec3 start = vec3(uv+surfacePosition,0.0);
	vec3 dir = normalize(start-eye);
	vec3 pos = eye;
	vec3 norm = vec3(0.0);
	
	//start += mod(mod(start+mod(start, vec3(j/17.0)), vec3(j)), 20.0*j);
	//start += noise (start, j);
	float d = 1.0/0.0;
	float sum = eps*2.001;
	float ep = eps;
	
	
	float inside = 0.0;
	bool far = true;
	
	float it_count = 0.0;
	
	float accum = 0.0;

	for (int i = 0; i<it_max; i++)
	{
		it_count++;
		pos = start+dir*sum;
		d = dist(pos);
		//ep = eps + eps*dot(length(pos),length(pos));
		ep = eps + eps*pow(2.0,length(pos));
		
		norm = getnormal(pos,ep);
		float bla = max(0.0, dot(norm, normalize(pos-light)));
		bla += max(0.0, dot(norm, normalize(pos-light2)));
		bla += max(0.0, dot(norm, normalize(pos-light3)));
		bla += max(0.0, dot(norm, normalize(pos-light4)));
		accum += d*4.0;//*bla;
		
		
		if (d < ep)
		{
			inside = 1.0;
			//inside = -d;
			
			far = false;
			break;
		}else
		
		if (length(pos) > max_dist)
		{
			far = true;
			inside = 0.0;
			pos = normalize(pos)*max_dist;
			accum = 0.0;
			break;		
		}
		sum += d*0.99;
		//pos += dir*d;
		
	}
	
	
	float bla = 0.0;
	float bla2 = 0.0;
	float bla3 = 0.0;
	float bla4 = 0.0;
	
	float sh = 1.0;
	float sh2 = 1.0;
	float sh3 = 1.0;
	float sh4 = 1.0;
	
	if (far == false )
	{
		norm = getnormal(pos, ep);
		float v = length(pos-light);
		bla = max(0.0, dot(norm, normalize(pos-light)));
		bla *= bla/v;
		
		v = length(pos-light2);
		bla2 = max(0.0, dot(norm, normalize(pos-light2)));
		bla2 *= bla2/v;
		
		v = length(pos-light3);
		bla3 = max(0.0, dot(norm, normalize(pos-light3)));
		bla3 *= bla3/v;
		
		v = length(pos-light4);
		bla4 = max(0.0, dot(norm, normalize(pos-light4)));
		bla4 *= bla4/v;
		
		
		sh = shadow(light,pos,1.0);
		sh2 = shadow(light2,pos,1.0);
		sh3 = shadow(light3,pos,1.0);
		sh4 = shadow(light4,pos,1.0);
		
		//sh *= sh2*sh3*sh4;
		
		if (false)
		{
			sh = 1.0;
			sh2 = 1.0;
			sh3 = 1.0;
			sh4 = 1.0;
		}
		
		
	}
	
	
	//col += inside*vec3(0.0,0.0,1.0)*length(pos.z);
	
	//inside = clamp(1.0-inside,0.0,1.0);
	//inside = clamp(1.0-inside,0.0,1.0);
	//inside = 1.0-inside;
	//inside = 1.0-smoothstep(0.0,1.0,inside);
	if (inside >=1.0) col = vec3(0.2);
	
	vec3 lc = vec3(0.6,1.0,0.6);
	vec3 lc2 =vec3(0.0,0.8,1.2);
	vec3 lc3 =vec3(1.0);
	vec3 lc4 =vec3(1.0,0.6,0.2);
	
	//col += vec3(1.0,0.0,0.0)*mod(10.,length(pos))/length(pos);
	
	
	
	col = lc*bla*sh;
	
	col = sqrt(pow(col,vec3(2.0))+pow(lc*bla*sh,vec3(2.0)));
	//col += inside*lc2*bla2*sh2;
	
	
	//col += inside*lc3*bla3*sh3/10.;
	//col += lc4*bla4*sh4;
	
	
	col = sqrt(pow(col,vec3(2.0))+pow(lc4*bla4*sh4,vec3(2.0)));
	
	

	
	//col = smoothstep(vec3(0.0),vec3(1.0),col);
	//col *= 1.0/pow(1.21,length(pos));
	//if (far) {col = vec3(0.0);}
	//col.r = it_count/50.0;
	
	//col += (1.0-inside)*vec3(1.0,0.8,0.2)*length(pos-eye)/sum;
	//col += (1.0-inside)*vec3(1.0,0.8,0.2);
	
	//accum = 1.0;
	
	//col += col*(smoothstep(0.0,1.0,1./sqrt(accum)));
	//col *= log2(accum)/2.;
	
	
	gl_FragColor = vec4( col, 1.0 );
}