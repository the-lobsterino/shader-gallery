#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

 

const int iters = 256;

const float origin_z = 0.0;
const float plane_z = 4.0;
const float far_z = 64.0;

const float astep = (far_z - plane_z) / float(iters) * 0.025;

const float color_bound = 0.0;
const float upper_bound = 1.0;

const float scale = 32.0;

float speed=0.8;

const float disp = 0.25;
// fx 22
vec3 diskWithMotionBlur( vec3 col, in vec2 uv, in vec3 sph, in vec2 cd, in vec3 sphcol )
{
	vec2 xc = uv - sph.xy;
	float a = dot(cd,cd);
	float b = dot(cd,xc);
	float c = dot(xc,xc) - sph.z*sph.z;
	float h = b*b - a*c;
	if( h>0.0 )
	{
		h = sqrt( h );
		
		float ta = max( 0.0, (-b - h)/a );
		float tb = min( 1.0, (-b + h)/a );
		
		if( ta < tb ) // we can comment this conditional, in fact
		    col = mix( col, sphcol, clamp(2.0*(tb-ta),0.0,1.0) );
	}

	return col;
}


vec3 hash3( float n ) { return fract(sin(vec3(n,n+1.0,n+2.0))*43758.5453123); }
vec4 hash4( float n ) { return fract(sin(vec4(n,n+1.0,n+2.0,n+3.0))*43758.5453123); }

 
vec2 getPosition( float time, vec4 id ) { return vec2(       0.9*sin((speed*(0.75+0.5*id.z))*time+20.0*id.x),        0.75*cos(speed*(0.75+0.5*id.w)*time+20.0*id.y) ); }
vec2 getVelocity( float time, vec4 id ) { return vec2( speed*0.9*cos((speed*(0.75+0.5*id.z))*time+20.0*id.x), -speed*0.75*sin(speed*(0.75+0.5*id.w)*time+20.0*id.y) ); }
 

#define PI 3.1415926535
float calc_this(vec3 p, float disx, float disy, float disz)
{
	float c = sin(sin((p.x + disx) * sin(sin(p.z + disz)) + time) + sin((p.y + disy) * cos(p.z + disz) + 2.0 * time) + sin(3.0*p.z + disz + 3.5 * time) + sin((p.x + disx) + sin(p.y + disy + 2.5 * (p.z + disz - time) + 1.75 * time) - 0.5 * time));
	return c;
}

vec3 get_intersection(vec2 position)
{
	vec3 pos = vec3(position.x * scale, position.y * scale, plane_z);
	vec3 origin = vec3(0.0, 0.0, origin_z);

	vec3 dir = pos - origin;
	vec3 dirstep = normalize(dir) * astep;

	dir = normalize(dir) * plane_z;


	float c;

	for (int i=0; i<iters; i++)
	{
		c = calc_this(dir, 0.0, 0.0, 0.0);

		if (c > color_bound)
		{
			break;
		}

		dir = dir + dirstep;
	}

	return dir;
}

float rand(vec2 vector)
{
    return fract( 43758.5453 * sin( dot(vector, vec2(12.9898, 78.233) ) ) );
}

float get_bump_height(vec2 position)
{
	return sin((sin(position.x * 32.0) + sin(position.y * 24.0) + sin(position.x * 4.0 + sin(position.y * 8.0 + time))) * 4.0) * 0.5 + 0.5;
}

float get_light(vec2 position)
{
	vec2 tex = mod(position * 4.0, 1.0) - vec2(0.5);
	return 0.0005 / pow(length(tex), 4.0);
}



void main(void)
{

	float scale = 1.0;
	vec2 position=(gl_FragCoord.xy/resolution.xy);


	vec2 coord = mod(position,1.0);	// coordinate of single effect window (0.0 - 1.0)
	vec2 effect = floor(mod(position,4.0)); // effect number (0-3,0-3)
	//float effect_number = effect.y * 4.0 + effect.x;
	vec2 effect_group = floor(position) * 7.0; // effect group float id
	float effect_number =10.0;
	float gradient = 0.0;
	vec3 color = vec3(0.0);
 
	float angle = 0.0;
	float radius = 0.0;
	const float pi = 3.141592;
	float fade = 0.0;
 
	float u,v;
	float z;
 
	vec2 centered_coord = coord - vec2(0.5);

	float dist_from_center = length(centered_coord);
	float angle_from_center = atan(centered_coord.y, centered_coord.x);
	
 
	if (effect_number==0.0)
	{
		 gradient = mod(sin(coord.x*400.0) * sin(coord.y * 400.0) * 16.0 * time*speed, 1.0);
		//gradient = (rand( vec2(sin(coord*400.0))*time));
		color = vec3(gradient);
	}
	else if (effect_number==1.0)
	{
		color.r = sin(coord.x * 32.0) + sin(coord.y * 24.0) + sin(coord.x * 4.0 + sin(coord.y * 8.0 + time*speed));
		color.g = sin(coord.x * 16.0) + sin(coord.y * 12.0) + sin(coord.x * 8.0 + sin(coord.y * 16.0 + 2.0 * time*speed));
		color.b = sin(coord.x * 8.0) + sin(coord.y * 48.0) + sin(coord.x * 2.0 + sin(coord.y * 4.0 + 3.0 * time*speed));
	}
	else if (effect_number==2.0)
	{
		radius = dist_from_center + sin(time * speed*8.0) * 0.1 + 0.1;
		angle = angle_from_center + time;
 
		gradient = 0.5 / radius + sin(angle * 5.0) * 0.3;
		color = vec3(gradient, gradient / 2.0, gradient / 3.0);
	}
	else if (effect_number==3.0)
	{
		radius = dist_from_center;
		angle = angle_from_center + time;
 
		gradient = sin(mod(angle + sin(-radius + time*speed) * 2.0,2.0*pi) * 4.0) + 1.0;
		color = vec3(gradient/3.0, gradient / 2.0, gradient);
	}
	else if (effect_number==4.0)
	{
		float dist_from_center_y = length(centered_coord.y);
		u = 8.0/dist_from_center_y + 16.0*time;
		v = (16.0/dist_from_center_y)* centered_coord.x + sin(time*speed) * 8.0;
 
		fade = dist_from_center_y * 4.0;
		gradient = ((1.0 - pow(sin(u) + 1.0, 0.1)) + (1.0 - pow(sin(v) + 1.0, 0.1))) * fade;
		color = vec3(gradient / 2.0, gradient, gradient / 2.0);
	}
	else if (effect_number==5.0)
	{
		u = 8.0 / dist_from_center + 16.0 * time*speed;
		v = angle_from_center * 16.0;
 
		fade = dist_from_center * 2.0;
		gradient = ((1.0 - pow(sin(u) + 1.0, 0.1)) + (1.0 - pow(sin(v) + 1.0, 0.1))) * fade;
		color = vec3(gradient * 4.0, gradient, gradient / 2.0);
	}
	else if (effect_number==6.0)
	{
		for (float i=0.0; i<=32.0; i++)
		{
			vec2 blob_coord = vec2(sin(2.0*i + 2.0*time) * 0.4, cos(3.0*i + 3.0 * time*speed) * 0.4);
			gradient += ((0.0001 + sin(i*i + 4.0*time) * 0.000095)) / pow(length(centered_coord - blob_coord), 2.75);
		}
		color = vec3(gradient, gradient * 2.0, gradient / 2.0);
	}
	else if (effect_number==7.0)
	{
		gradient = 1.0;
		for (float i=0.0; i<=16.0; i++)
		{
			vec2 blob_coord = vec2(sin(32.0*i + 0.5*time) * 0.5, cos(256.0*i + 1.0 * time*speed) * 0.5);
			gradient = min(gradient, length(centered_coord - blob_coord));
		}
		gradient = pow(sin(gradient), 2.0) * 16.0;
		color = vec3(gradient / 1.5, gradient / 2.0, gradient * 1.5);
	}
	else if (effect_number==8.0)
	{
		float disp = 0.005;
		float p00 = get_bump_height(centered_coord);
		float p10 = get_bump_height(centered_coord + vec2(disp, 0.0));
		float p01 = get_bump_height(centered_coord + vec2(0.0, disp));
 
		float dx = p10 - p00;
		float dy = p01 - p00;
 
		vec2 light_coord = vec2(sin(time) * 0.3, sin(2.0*time*speed) * 0.3);
		vec2 disp_coord = centered_coord - vec2(dx, dy);
		gradient = 0.1 / length(disp_coord - light_coord);
		color = vec3(gradient, gradient, gradient * 1.25);
	}
	else if (effect_number==9.0)
	{
		vec2 rotated_coord;
		float zoom = sin(time) + 1.25;
		rotated_coord.x = zoom * (centered_coord.x * cos(time) - centered_coord.y * sin(time*speed));
		rotated_coord.y = zoom * (centered_coord.y * cos(time) + centered_coord.x * sin(time*speed));

		vec2 pix = floor(rotated_coord * 8.0);

		gradient = mod(mod(pix.x,2.0) + mod(pix.y,2.0),2.0);
		color = vec3(gradient);

		float raster1 = 0.01 / length(centered_coord.y - sin(1.5 * time) * 0.5);
		float raster2 = 0.01 / length(centered_coord.y - sin(1.5 * time + 0.3) * 0.5);
		float raster3 = 0.01 / length(centered_coord.y - sin(1.5 * time + 0.6) * 0.5);
		vec3 rcolor;
		if (raster1 > 0.25 || raster2 > 0.25 || raster3 > 0.25)
		{
			rcolor = vec3(raster1, 0.0, 0.0);
			rcolor += vec3(0.0, raster2, 0.0);
			rcolor += vec3(0.0, 0.0, raster3);
			color = rcolor;
		}
	}
	else if (effect_number==10.0)
	{
		for (float i=1.0; i<=128.0; i++)
		{
			vec2 star_pos = vec2(sin(i) * 64.0, sin(i*i*i) * 64.0);
			float z = mod(i*i - time*300.0, 256.0);
			float fade = (256.0 - z) / 256.0;
			vec2 blob_coord = star_pos / z;
			gradient += ((fade /384.0) / pow(length(centered_coord - blob_coord), 1.5)) * (fade * fade);
		}

		color = vec3(gradient * 2.0, gradient, gradient / 2.0);
	}
	else if (effect_number==11.0)
	{
		float z = sqrt(0.25 - centered_coord.x * centered_coord.x - centered_coord.y * centered_coord.y);
		vec2 tex = (centered_coord * 32.0) / z;
 
		fade = pow(z,2.0);
		vec2 discolamp = vec2(pow(sin(tex.x + sin(0.5 * time) * 64.0) + 1.0, 2.0), pow(sin(tex.y + sin(0.4 * time) * 128.0) + 1.0, 2.0));
		gradient = (4.0 - discolamp.x - discolamp.y) * fade;
		color = vec3(gradient * 4.0, gradient, gradient / 2.0);
	}
	else if (effect_number==12.0)
	{
		const float steps = 64.0;
		float sum = 0.0;
		for (float i=0.0; i<=steps; i++)
		{
			vec2 light_coord = centered_coord + vec2(sin(time), sin(time * 1.24));
			vec2 displacement = vec2(mix(centered_coord, 0.25 * light_coord, (steps - i) / steps));
			sum = mix(get_light(centered_coord + displacement), sum, 0.9);
		}
		gradient = sum;
if (gradient <= 0.1) gradient = length(centered_coord) * 0.25;
		color = vec3(gradient * 4.0, gradient, gradient / 2.0);
	}
	else if (effect_number==13.0)
	{
		float xpos = -0.5 + sin(centered_coord.y * 16.0 + time) * 0.06;
		float ypos = 0.0 + sin(centered_coord.x * 24.0 + 1.5 * time) * 0.04;
		const float z_fractal = 0.4;

		const float iter = 64.0;
		const float iter2 = iter / 4.0;
	
		float z0_r = 0.0;
		float z0_i = 0.0;
		float z1_r = 0.0;
		float z1_i = 0.0;
		float p_r = (centered_coord.x + xpos * z_fractal) / z_fractal;
		float p_i = (centered_coord.y + ypos * z_fractal) / z_fractal;
		float d = 0.0;
	
		float nn;
		for (float n=0.0; n<=iter; n++)
		{
			z1_r = z0_r * z0_r - z0_i * z0_i + p_r;
			z1_i = 2.0 * z0_r * z0_i + p_i;
			d = sqrt(z1_i * z1_i + z1_r * z1_r);
			z0_r = z1_r;
			z0_i = z1_i;
			if (d > iter2) break;
			nn = n;
		}
	
		gradient = (nn / iter) * 4.0;
	
		color = vec3(gradient * 2.0, gradient, gradient * 16.0);
	}
	else if (effect_number==14.0)
	{
		float zom = 3.5;
		float x0 = centered_coord.x * zom;
		float y0 = centered_coord.y * zom;

		float x1, y1, mj2;
		const float iter = 32.0;

		float posx = sin(time * 2.0) * 0.75;
		float posy = sin(time * 1.5) * 0.75;

		float nn;
		for (float n=0.0; n<=iter; n++)
		{
			x1 = x0*x0 - y0*y0 + posx;
			y1 = 2.0*x0*y0 + posy;
			mj2 = x1*x1 + y1*y1;
			x0 = x1; y0 = y1;
			nn = n;
			if (mj2 > iter) break;
		}

		gradient = (nn / iter) * 2.0;

		color = vec3(1.0 - gradient, 1.0 - gradient * 2.0, gradient * 2.0);
	}
	else if (effect_number==15.0)
	{
		vec3 p = get_intersection(centered_coord);
		float dx = color_bound - calc_this(p, disp, 0.0, 0.0);
		float dy = color_bound - calc_this(p, 0.0, disp, 0.0);
	
		vec3 du = vec3(disp, 0.0, dx);
		vec3 dv = vec3(0.0, disp, dy);
		vec3 normal = normalize(cross(du, dv));
	
		vec3 light = normalize(vec3(0.0, 0.0, 1.0));
		float l = dot(normal, light);
	
		gradient = pow(l, 2.0);
		color = vec3(gradient*0.8, gradient*0.5, gradient*0.2);
	}
 else if (effect_number==16.0)
	{
	
        vec2 rotated_coord;
		

		vec2 pix = floor(rotated_coord * 8.0);

		gradient = mod(mod(pix.x,2.0) + mod(pix.y,2.0),2.0);
		color = vec3(gradient);

		float raster1 = 0.01 / length(centered_coord.y - sin(1.5 * time*speed) * 0.5);
		float raster2 = 0.01 / length(centered_coord.y - sin(1.5 * time*speed + 0.3) * 0.5);
		float raster3 = 0.01 / length(centered_coord.y - sin(1.5 * time*speed + 0.6) * 0.5);
		vec3 rcolor;
		if (raster1 > 0.25 || raster2 > 0.25 || raster3 > 0.25)
		{
			rcolor = vec3(raster1, raster2, 0.0);
			rcolor += vec3(0.0, raster2, 0.0);
			rcolor += vec3(0.0, raster1, raster3);
			color = rcolor;
		}
	}
  else if (effect_number==17.0)
	{
	 
	float u = length(centered_coord);
	float v = atan(centered_coord.y, centered_coord.x);
	float t = time / 0.5 + 1.0 / u;
	
	float intensity = abs(sin(t * 10.0 + v)+sin(v*8.0)) * .25 * u * 0.25;
	vec3 colora = vec3(-sin(v*4.0+v*2.0+time), sin(u*8.0+v-time), cos(u+v*3.0+time*speed))*16.0;
	 		
	color=vec3(colora*2.0 * intensity * (u * 4.0));
		
	}
 
  else if (effect_number==18.0)
	{
	 
	float dist = distance(vec2(0.0), centered_coord);
	float dist2 = float(int(dist*10.0))/10.0; // 10 steps in 1.
	float angle = atan(centered_coord.y, centered_coord.x);
    
	float value;
	value = abs(2.0-dist2) * abs(sin(sin(dist2*time*speed*-8.)+2.*time*speed*(1.0+dist2)+angle*3.));
	vec3 colora = pow(value, 3.0) * vec3(0.7,0.4,0.0) * 0.4; 
	
		color=colora;
	}
    else if (effect_number==19.0)
	{
	float r=abs(sin(position.x+position.y*50.-(time*speed) ));
	float g=abs(sin(position.x+position.y*50.-(time*speed )));
	float b=abs(sin(position.x+position.y*50.-(time*speed) ));
	vec3 colora =vec3(r,0.0,b);
	 color=colora;
	}
  
  else if (effect_number==20.0)
	{
	 
	float d2D = 1.0 / length (centered_coord) + time;
	float a2D = atan (centered_coord.y,centered_coord.x) + sin (time * speed*0.2) * 3.14159;
	vec3 colorm = vec3 (0.5 + sin (d2D * 8.0) * 0.8, 0.5 + sin (a2D * 8.0) * 0.8, 0.5 + sin (d2D * 4.0) * sin (a2D * 4.0) * 0.8);
	color=colorm*2.0;
	}
  else if (effect_number==21.0)
	{
	float len = length(centered_coord);
	
    float t = time*speed;
	float time = t  +  (5.+sin(t))*.11 / (len+.07); // spiraling
	float si = sin(time), co = cos(time);
	centered_coord*= mat2(co, si, -si, co);                    // rotation

	float c=0., v1=0., v2=0., v3;  vec3 p;
	
	for (int i = 0; i < 100; i++) {
		p = .035*float(i) *  vec3(centered_coord, 1.);
		p += vec3(.22,  .3,  -1.5 -sin(t*1.3)*.1);
		
		for (int i = 0; i < 8; i++)                // IFS
			p = abs(p) / dot(p,p) - 0.659;

		float p2 = dot(p,p)*.0015;
		v1 += p2 * ( 1.8 + sin(len*13.0  +.5 -t*2.) );
		v2 += p2 * ( 1.5 + sin(len*13.5 +2.2 -t*3.) );
	}
	
	c = length(p.xy) * .175;
	v1 *= smoothstep(.7 , .0, len);
	v2 *= smoothstep(.6 , .0, len);
	v3  = smoothstep(.15, .0, len);

	vec3 col = vec3(c,  (v1+c)*.25,  v2);
	col = col  +  v3*.9;                      // useless: clamp(col, 0.,1.)
	color=col;
	}
  else if (effect_number==22.0)
	  
	{
	 
	vec3 col = vec3(0.2) + 0.05*centered_coord.x;
	
	for( int i=0; i<16; i++ )
	{		
		vec4 off = hash4( float(i)*13.13 );
        vec3 sph = vec3( getPosition( time, off ), 0.02+0.1*off.x );
        vec2 cd = getVelocity( time, off ) /24.0 ;
		vec3 sphcol = 0.7 + 0.3*sin( 3.0*off.z + vec3(4.0,0.0,2.0) );
		
       col = diskWithMotionBlur( col, 2.4*centered_coord, sph, cd, sphcol);
		
		
		
	}		

    col += (1.0/255.0)*hash3(centered_coord.x+13.0*centered_coord.y);

	//fragColor = vec4(col,1.0);
	color=col;
//void main( void ){vec4 color = vec4(0.0,0.0,0.0,1.0);mainImage( color, gl_FragCoord.xy );color.w = 1.0;gl_FragColor = color;}
		
	}	
	else if (effect_number==23.0)
	{
	
   // vec2 resolution=vec2(400,-100);
  //  vec2 position = ( gl_FragCoord / resolution );

  float r = 0.1;
  float g = 0.1;
  float b = 0.1;
  float t = length(centered_coord)*8.0 + time*speed;
  float s = coord.y*8.0 + time*speed;
  r += sin(t); 
  g += sin(s); 
  b += sin(t+s);
  vec3  colora=vec3((1.0+r)/2.,(1.0+g)/2.,(1.0+b)/2.);
  color = colora*2.0;
   }
	else if (effect_number==24.0)
   {
	float color_r = 0.0;
	float color_g = 0.0;
	float color_b = 0.0;
   
   color_r = ((1.0+sin(gl_FragCoord.x*0.2*cos(time*0.1)))/2.0)+((1.0+sin(gl_FragCoord.y*0.2*cos(time*speed)))/2.0);
   color_g = ((1.0+sin(0.2+gl_FragCoord.x*0.1*cos(time*0.1)))/2.0)+((1.0+sin(gl_FragCoord.y*0.1*cos(time*speed)))/2.0);
   color_b = ((1.0+sin(0.1+gl_FragCoord.x*0.1*cos(time*0.15)))/2.0)+((1.0+sin(gl_FragCoord.y*0.1*cos(time*speed)))/2.0);

	color= vec3(color_r, color_g, color_b);
     }	
		
  else if (effect_number==25.0)
  {
	 
	
	vec2 position = centered_coord;
	float sinT = sin(time);
	float th = atan(position.y, position.x) / (2.0 * 3.1415926) + 0.5 + sinT;
	float dd = length(position);
	float d = 0.25 / dd + time*speed + sinT;

	vec3 uv = vec3(th + d, th - d, th + sin(d) * 0.3);
	float a = 0.5 + cos(uv.x * 3.1415926 * 2.0) * 5.5;
	float b = 0.5 + cos(uv.y * 3.1415926 * 10.0) * 5.5;
	float c = 0.5 + cos(uv.z * 3.1415926 * 6.0) * 0.1;
	vec3 colora = mix(vec3(1.0, 0.8, 0.9), vec3(0.1, 0.1, 0.2), pow(a, 0.1)) * 10.0 * sin(time * 0.5*speed) + 0.3;
	colora += mix(vec3(0.8, 0.9, 1.0), vec3(0.1, 0.1, 0.2),  pow(b, 0.1)) * 0.75 * sin(time * 0.6*speed) + 0.3;
	colora += mix(vec3(0.9, 0.8, 1.0), vec3(0.1, 0.2, 0.2),  pow(c, 0.1)) * 0.75 * sin(time * 0.7*speed) + 0.3;
	color = vec3(colora*2.0 * clamp(dd, 0.0, 1.0));
	  
  }
 
    
 
	color.r *= (sin(effect_group.x) * 0.5 + 0.5);
	color.g *= (sin(effect_group.y) * 0.5 + 0.5);
	color.b *= (sin(effect_group.x * effect_group.y) * 0.5 + 0.5);
 
	gl_FragColor = vec4(color, 1.0 );
}



