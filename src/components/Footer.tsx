import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Footer() {
	return (
		<>
			<Separator />

			<footer className=" py-10 px-4 md:px-10">
				<div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
					<div className="space-y-3">
						<h6 className="text-sm font-medium text-foreground">
							Branding
						</h6>
						<ul className="space-y-2">
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
								>
									Branding
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
								>
									Design
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
								>
									Marketing
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
								>
									Advertisement
								</Button>
							</li>
						</ul>
					</div>

					<div className="space-y-3">
						<h6 className="text-sm font-medium text-foreground">
							Branding
						</h6>
						<ul className="space-y-2">
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
								>
									Branding
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
								>
									Design
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
								>
									Marketing
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
								>
									Advertisement
								</Button>
							</li>
						</ul>
					</div>

					<div className="space-y-3">
						<h6 className="text-sm font-medium text-foreground">
							Socials
						</h6>
						<div className="flex space-x-4">
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full h-10 w-10"
								asChild
							>
								<a
									href="https://twitter.com"
									target="_blank"
									rel="noopener noreferrer"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										className="fill-current"
									>
										<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
									</svg>
								</a>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full h-10 w-10"
								asChild
							>
								<a
									href="https://www.youtube.com/channel/UC8-rLV9b_FbNuoxYhwtyPMA"
									target="_blank"
									rel="noopener noreferrer"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										className="fill-current"
									>
										<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
									</svg>
								</a>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full h-10 w-10"
								asChild
							>
								<a
									href="https://www.facebook.com/CherkasyPhymly/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										className="fill-current"
									>
										<path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
									</svg>
								</a>
							</Button>
						</div>
					</div>
				</div>
			</footer>
			<div className=" py-5 text-center text-sm ">
				<p>
					Copyright © {new Date().getFullYear()} - MIT Licensed by
					bynarig with 💕
				</p>
			</div>
		</>
	);
}
