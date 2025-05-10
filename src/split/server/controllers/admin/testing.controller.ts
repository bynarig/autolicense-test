import { NextRequest, NextResponse } from "next/server";
import { TestingService } from "@server/services/testing.service";
import { BaseController } from "@server/controllers/base.controller";
import { auth } from "@server/config/auth-js";

type tParams = Promise<{ id: string }>;

export class TestingController extends BaseController {
	constructor(private testingService: TestingService) {
		super();
	}

	getTests = async (req: NextRequest): Promise<NextResponse> => {
		try {
			const result = await this.testingService.getAllTests();
			return NextResponse.json(
				{
					success: true,
					data: result.tests,
					pagination: result.pagination,
				},
				{ status: 200 },
			);
		} catch (error) {
			return NextResponse.json(
				{ success: false, message: "Failed to fetch tests" },
				{ status: 500 },
			);
		}
	};
	getTest = async (
		req: NextRequest,
		{ params }: { params: tParams },
	): Promise<NextResponse> => {
		try {
			const { id }: { id: string } = await params;
			const result = await this.testingService.getTest(id);
			return NextResponse.json(
				{ success: true, data: result },
				{ status: 200 },
			);
		} catch (error) {
			return NextResponse.json(
				{ success: false, message: "Failed to fetch test" },
				{ status: 500 },
			);
		}
	};
	deleteTest = async (
		req: NextRequest,
		{ params }: { params: tParams },
	): Promise<NextResponse> => {
		try {
			const { id }: { id: string } = await params;
			const result = await this.testingService.deleteTest(id);
			return NextResponse.json(
				{ success: true, data: result },
				{ status: 200 },
			);
		} catch (error) {
			return NextResponse.json(
				{ success: false, message: "Failed to delete test" },
				{ status: 500 },
			);
		}
	};

	createTest = async (req: NextRequest): Promise<NextResponse> => {
		try {
			const body = await req.json();
			const { testName } = body;
			const session = await auth();

			if (!testName) {
				return NextResponse.json(
					{ success: false, message: "Test name is required" },
					{ status: 400 },
				);
			}

			const result = await this.testingService.createTest({
				title: testName,
				authorId: session?.user.id,
			});

			return NextResponse.json(
				{ success: true, data: result },
				{ status: 201 },
			);
		} catch (error) {
			return NextResponse.json(
				{ success: false, message: "Failed to create test" },
				{ status: 500 },
			);
		}
	};
}
