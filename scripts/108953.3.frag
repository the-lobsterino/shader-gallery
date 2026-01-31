#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

float alpha = 0.5;

float EPS_F = 1e-6;

vec2 P1 = vec2(0.0, 0.5);
vec2 P2 = vec2(0.5, -0.5);
vec2 P3 = vec2(-0.5, -0.5);

vec3 TRIANGLE_COLOR = vec3(0.2, 0.5, 0.8);

#define CLAMP_POINTS_ON_BBOX(points, box)                 \
    for (int i = 0; i < 4; i++)                           \
    {                                                     \
        points[i].x = clamp(points[i].x, box.x1, box.x2); \
        points[i].y = clamp(points[i].y, box.y1, box.y2); \
    }

struct bbox2f
{
    float x1;

    float y1;

    float x2;

    float y2;
};
	
float calc_bbox2f_area(in bbox2f box)
{
	return (box.x2 - box.x1) * (box.y2 - box.y1);
}

struct line2f
{
    float x1;

    float y1;

    float x2;

    float y2;
};
	
bbox2f get_line_bbox(line2f line)
{
	float left  = min(line.x1, line.x2);
	float right = max(line.x1, line.x2);
	
	float top    = min(line.y1, line.y2);
	float bottom = max(line.y1, line.y2);
	
	return bbox2f(left, top, right, bottom);
}

struct cross_points
{
    vec2 first;

    vec2 second;

    vec2 third;

    vec2 fourth;
};

void clamp_points_on_bbox(out vec2[4] points, in bbox2f box)
{
    for (int i = 0; i < 4; i++)                           
    {                                                     
        points[i].x = clamp(points[i].x, box.x1, box.x2); 
        points[i].y = clamp(points[i].y, box.y1, box.y2); 
    }
}

	
void calculate_cross_points(in line2f line, in bbox2f pixel_box, out vec2[4] cross_points)
{
    // calculate in order [left, top, right, bottom]
	
    float x1 = line.x1;
    float y1 = line.y1;

    float x2 = line.x2;
    float y2 = line.y2;
    bbox2f line_box = get_line_bbox(line);
	
    float relative_eps = max(pixel_box.x2 - pixel_box.x1, pixel_box.y2 - pixel_box.y1) * EPS_F;

    if (abs(x2 - x1) < relative_eps || abs(y2 - y1) < relative_eps)
    {
	cross_points[0] = vec2(pixel_box.x1, y1);
        cross_points[1] = vec2(x1, pixel_box.y1);
	
	cross_points[2] = vec2(pixel_box.x2, y2);
        cross_points[3] = vec2(x2, pixel_box.y2);
	
	clamp_points_on_bbox(cross_points, line_box);
	clamp_points_on_bbox(cross_points, pixel_box);
    }
	else
	{
		float a = (y2 - y1) / (x2 - x1);
		float b = y1 - a * x1;
		
		// Calculate left crossing
		float left_cross_y = a * pixel_box.x1 + b;
		cross_points[0]    = vec2(pixel_box.x1, left_cross_y);
		
		// Calculate top crossing
		float top_cross_x = (pixel_box.y1 - y1) / (y2 - y1) * (x2 - x1) + x1;
		cross_points[1]   = vec2(top_cross_x, pixel_box.y1);
		
		// Calculate right crossing
		float right_cross_y = a * pixel_box.x2 + b;
		cross_points[2]     = vec2(pixel_box.x2, right_cross_y);
		
		// Calculate bottom crossing
		float bottom_cross_x = (pixel_box.y2 - y1) / (y2 - y1) * (x2 - x1) + x1;
		cross_points[3]      = vec2(bottom_cross_x, pixel_box.y2);
		
		clamp_points_on_bbox(cross_points, line_box);
		clamp_points_on_bbox(cross_points, pixel_box);
	}
}

void swap_vec2(out vec2 v1, out vec2 v2)
{
	vec2 t = v1;
	v1     = v2;
	v2     = t;
}

float cos_angle_vec2(in vec2 v1, in vec2 v2)
{
	return dot(v1, v2) / (length(v1) * length(v2));
}


void order_cross_points(out vec2[4] cross_points, line2f line)
{
	if(line.x1 > line.x2)
	{
		vec2 t = cross_points[0];
		cross_points[0] = cross_points[2];
		cross_points[2] = t;
	}
	
	if(line.y1 > line.y2)
	{
		vec2 t = cross_points[1];
		cross_points[1] = cross_points[3];
		cross_points[3] = t;
	}
	
	vec2 line_vec = vec2(line.x2, line.y2) - vec2(line.x1, line.y1);
	vec2 line_first_p = vec2(line.x1, line.y1);
	
	vec2 first_vec = cross_points[0] - line_first_p;
	
	float first_cos = cos_angle_vec2(first_vec, line_vec);
	vec2 second_vec = cross_points[1] - line_first_p;
	float second_cos = cos_angle_vec2(second_vec, line_vec);
	
	if(first_cos > second_cos)
	{
		vec2 t = cross_points[0];
		cross_points[0] = cross_points[1];
		cross_points[1] = t;
	}
	
	vec2 third_vec = cross_points[2] - line_first_p;
	float third_cos = cos_angle_vec2(third_vec, line_vec);
	
	vec2 fourth_vec = cross_points[3] - line_first_p;
	float fourth_cos = cos_angle_vec2(fourth_vec, line_vec);
	
	if(third_cos < fourth_cos)
	{
		vec2 t = cross_points[2];
		cross_points[2] = cross_points[3];
		cross_points[3] = t;
	}
	
}

float calc_hex_poly_area(in vec2[6] hex_poly)
{
	// calculate first sum
	
	float first_sum = 0.0;
	float y1 = hex_poly[0].y;
	float xn = hex_poly[5].x;
	
	for(int i = 0; i < 5; i++)
	{
		float x_i   = hex_poly[i].x;
		float y_ip1 = hex_poly[i + 1].y;
		
		first_sum += x_i * y_ip1;
	}
	
	first_sum += xn * y1;
	
	// calculate second sum
	float second_sum = 0.0;
	
	float x1 = hex_poly[0].x;
	float yn = hex_poly[5].y;
	
	
	for(int i = 0; i < 5; i++)
	{
		float x_ip1 = hex_poly[i + 1].x;
		float y_i   = hex_poly[i].y;
		
		second_sum += x_ip1 * y_i;
	}

	second_sum += x1 * yn;
	
	
	
	// calculate final area
	float poly_area = abs(first_sum - second_sum) / 2.0;
	
	return 0.5;
}

void main(void)
{
	vec2 position = gl_FragCoord.xy;
	
    	float pixel_w = 2.0 / resolution.x;
    	float pixel_h = 2.0 / resolution.y;
	
	bbox2f pixel_box = bbox2f(
		position.x - pixel_w / 2.0, 
		position.y + pixel_h / 2.0,
		position.x + pixel_w / 2.0,
		position.y - pixel_h / 2.0
	);
	
	vec2 hex_poly[6];
	
	// first line
	line2f first_line = line2f(P1.x, P1.y, P2.x, P2.y);
	vec2 first_cross[4];
	calculate_cross_points(first_line, pixel_box, first_cross);
	order_cross_points(first_cross, first_line);
	hex_poly[0] = first_cross[1];
	hex_poly[1] = first_cross[2];
	
	// second line
	line2f second_line = line2f(P2.x, P2.y, P3.x, P3.y);
	vec2 second_cross[4];
	calculate_cross_points(second_line, pixel_box, second_cross);
	order_cross_points(second_cross, second_line);
	hex_poly[2] = second_cross[1];
	hex_poly[3] = second_cross[2];
	
	// third line
	line2f third_line = line2f(P3.x, P3.y, P1.x, P1.y);
	vec2 third_cross[4];
	calculate_cross_points(third_line, pixel_box, third_cross);
	order_cross_points(third_cross, third_line);
	hex_poly[4] = third_cross[1];
	hex_poly[5] = third_cross[2];
	
	float hex_area = calc_hex_poly_area(hex_poly);
	
	float relative_area = hex_area / calc_bbox2f_area(pixel_box);
	
	vec3 triangle_color = TRIANGLE_COLOR * relative_area;
	
    	gl_FragColor = vec4(triangle_color, 1.0);
}