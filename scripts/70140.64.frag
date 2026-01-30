/*
 * Original shader from: http://glslsandbox.com/e#55620.1
 */

/*
 *Using spherical coordinates to map up Mandelbulb(loop everytime)

 REFERENCE:
 Mandebulb:
 https://en.wikipedia.org/wiki/Mandelbulb#:~:text=The%20Mandelbulb%20is%20a%20three,dimensional%20space%20of%20complex%20numbers.

 Spherical coordinates:
 https://en.wikipedia.org/wiki/Spherical_coordinate_system

 AMAZING Reference to read:
 http://blog.hvidtfeldts.net/index.php/2011/06/distance-estimated-3d-fractals-part-i/
 
 Some other document to read:
 http://www.fractal.org/Formula-Mandelbulb.pdf
 https://archive.bridgesmathart.org/2010/bridges2010-247.pdf
 */

/*
  Mandelbulb and Mandelbox are ESCAPE-TIME FRACTALS: 
  we iterate a function for each point in space, and follow the orbit to see whether the sequence of points 
  diverge for a maximum number of iterations, or whether the sequence stays inside a fixed escape radius. 
 */


/*
 Experiment of:
 Raymarching technique
 */

#ifdef GL_ES
precision mediump float;
#endif
	
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

//Declare two time value here
float t1 = 0.0;
float t2 = 0.0;	

float mandelbulb(vec3 pos){
    const int MAX_ITER = 10; //Number of iteration
    const float BAILOUT=4.0; //When to exit the loop

    //---> 	
    //---> For power>3, the result is a 3D bulb-like structure with fractal surface detail, and a number of "lobes" depending on power.	
    //float Power=5.+sin(t2*3.)*3.; //Power 
	//float Power=3.+sin(t2*-1.5)*0.35;
	float Power=5.-3.;
    //float Power=3.;	

    //Declare bunch of stuff we are going to use here	
    vec3 inputPos = pos;
    float r1=0.0;
    float d1=1.0;
    for(int n=0; n<=MAX_ITER; ++n)
    {
        //🌟🌟 Extract polar coordinates      
        //Now start calculate the Spherical coordinates value, r1, theta and phi
        r1 = length(pos); //equal to sqrt(pos.x*pos.x+pos.y*pos.y+pos.z*pos.z);
	    
	//When length(pos)>4.,escape the loop     
        if(r1>BAILOUT) break; 
        
        float theta = acos(pos.z/r1) ;//+ sin(t1); 
        float phi = atan(pos.y, pos.x); 
	    
	    /*
	    //--->
	    //Reference:https://www.iquilezles.org/www/articles/mandelbulb/mandelbulb.htm
            float theta = acos(pos.y/r1) ;//Try Power 2. and 3.
            float phi = atan(pos.x, pos.z);
	    */
	    
	//Distance estimator?
	//Adjust the clipping?    
        d1 = pow(r1,Power-1.2)*Power*d1 ;//+ sin(time); 
	    
        //🌟🌟 Scale and rotate the point    
        float zr = pow(r1,Power); //power of r value that will multiply in the position later
	    
	      
	    //---> Have fun remove some Power here
	    //---> Actually the (p,q) value (check wiki page) are not necessary equal to Power, have fun changing that
	    pos = (vec3(sin(theta*Power*(2.+mouse.x*2.5))*cos(phi*Power), sin(phi*Power*(2.+mouse.x*2.5))*sin(theta*Power), cos(theta*Power))*zr)+inputPos;   
	    
	/*       
        theta = theta*Power;
        phi = phi*Power;//+0.2
	    
	//🌟🌟 Convert back to cartesian coordinates  
	//Update the position here    
	//pos = (vec3(sin(theta)*cos(phi),sin(theta)*cos(phi),-sin(theta))*zr)+inputPos;        
	pos = (vec3(sin(theta)*cos(phi),sin(theta)*cos(phi),cos(theta))*zr)+inputPos;  
	    //Original below
        pos = (vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta))*zr)+inputPos; */    
    }
	
    //🌟🌟 Return the distance estimator? / Smooth the edge?	
    //Adjust the clipping plane??
    return 0.4*log(r1)*r1/d1;
    //The value of the distance estimator tells you how large a step you are allowed to march along the way.
    //which means you need to guaranteed not to hit anything within this radius	
}

//Credit to Nan's code 
float project(float n, float start1, float stop1, float start2, float stop2){
	float newVal = (n-start1)/(stop1-start1)*(stop2-start2)+start2;
	return newVal;
}


/*
Raymarching technique - Distance Estimation
  Check http://blog.hvidtfeldts.net/index.php/2011/06/distance-estimated-3d-fractals-part-i/
  For all points in space returns a length smaller than (or equal to) the distance to the closest object.
  March the ray according to the distance estimator and return a greyscale value based on the number of steps before hitting something
  Proceed in small steps along the ray and check how close you are to the object you are rendering

  Distance estimation ONLY tells the distance from a point to an object.
  This in contrast to classic ray tracing, which is about finding the distance from a point to a given object along a line.
*/

float DE(vec3 z)
{
	vec3 a1 = vec3(1,1,1);
	vec3 a2 = vec3(-1,-1,1);
	vec3 a3 = vec3(1,-1,-1);
	vec3 a4 = vec3(-1,1,-1);
	vec3 c;
	int n = 0;
	int Iterations = 3;
	float Scale = 2.;
	float dist, d;
	if (n < Iterations) {
		 c = a1; 
		 dist = length(z-a1);
	         d = length(z-a2); if (d < dist) { c = a2; dist=d; }
		 d = length(z-a3); if (d < dist) { c = a3; dist=d; }
		 d = length(z-a4); if (d < dist) { c = a4; dist=d; }
		z = Scale*z-c*(Scale-1.0);
		n++;
	}

	return length(z) * pow(Scale, float(-n));
}

float trace(vec3 from, vec3 direction) {
	float totalDistance = 0.0;
	const int MaxRaySteps = 20000;
	const float MinDistance = 0.0001;
	float distance = 0.;
	vec3 p = vec3(0.);
	
	int steps = 0;
	for (int i=0; i < MaxRaySteps; i++) {
		distance = DE(p); //DistanceEstimator(p)
		totalDistance += distance;
		p = from + direction * totalDistance;
		if (distance < MinDistance) break;
	}
	return 1.0-float(steps)/float(MaxRaySteps);
}


void main( void ){
    t1 = time * 0.1;//1.1;
    t2 = time * 0.5;

    vec2 pos = (gl_FragCoord.xy*2.0 - resolution.xy) / resolution.y;
    //Stop Camera rotation here
    vec3 camPos = vec3(3.,3.,1.);//Use +abs(sin(time))*28. to test
    //vec3 camPos = vec3(cos(t2*0.3+t2), sin(t2*0.3-t2), 2.-sin(t2*.2)/2.);
    vec3 camTarget = vec3(0.0, 0.0, 0.0);

    vec3 camDir = normalize(camTarget-camPos);
    vec3 camUp  = normalize(vec3(0.0, 0.0, 0.8));
    //vec3 camUp  = normalize(vec3(0.0, 1.0, 0.8));
    vec3 camSide = cross(camDir, camUp);//Camera X position
    float focus = 5.5 + abs(sin(t2))*3.; //Move the camera back and forth
	
	
    vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus)*1.;//Can adjust the brightness with multiplication
    vec3 ray = camPos;
//    gl_FragColor = vec4(vec3(trace(ray, rayDir)),0.0);	
    	
    float count = 0.0;
    float d = 0.0, total_d = 0.0;
    const int MAX_MARCH = 1000;
    const float MAX_DISTANCE = 3000.0;
    const float MIN_DISTANCE = 0.0007;	 
    for(int i=0; i<MAX_MARCH; i++) {
        d = mandelbulb(ray);
        total_d += d;
        ray += rayDir * d;
        count += 1.0;//Coloring method:The Iteration Count is the number of iteration it tales before the orbit diverges(become larger than the escape radius)
        if(d<MIN_DISTANCE) { break; } // Escape when reach minimus value to the boundaries of the objects, to increase the efficency
        if(total_d>MAX_DISTANCE) { total_d=MAX_DISTANCE; break; }
    }
    float c = project(total_d,MIN_DISTANCE,MAX_DISTANCE,0.,1.);//sin(time*2.)
    //float c = (total_d)*0.00001;
    //vec4 result = vec4( 1.0-vec3(c, c, c) - vec3(0.1024576534223, 0.02506, 0.2532)*count*0.8, 1.0 ); 
    //vec4 result = vec4( 1.0-vec3(0.1*c, 2.0*c, 0.5*c+sin(time*2.)*3.) - vec3(0.02506, 0.1024576534223, 0.2532)*count*0.8, 1.0 ); 	
    vec4 result = vec4( 1.0-vec3(0.1*c, 2.0*c, 0.5*c) - vec3(0.02506, 0.1024576534223, 0.2532)*count*0.8, 1.0 ); 
    gl_FragColor = result;
}