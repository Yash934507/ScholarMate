import { Link } from "wouter"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, ShieldCheck, ShieldQuestion } from "lucide-react"
import {
  useAdminListScholarships,
  useAdminDeleteScholarship,
  useAdminSetScholarshipStatus,
  useAdminVerifyScholarship,
  getAdminListScholarshipsQueryKey,
} from "@workspace/api-client-react"

function statusBadgeVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "active": return "default"
    case "draft": return "secondary"
    case "expired":
    case "closed": return "destructive"
    default: return "outline"
  }
}

function verificationBadgeVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "verified": return "default"
    case "disputed":
    case "needs_update": return "destructive"
    default: return "secondary"
  }
}

export default function AdminScholarshipsList() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)

  const { data, isLoading, isError } = useAdminListScholarships()

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getAdminListScholarshipsQueryKey() })

  const deleteMutation = useAdminDeleteScholarship({
    mutation: {
      onSuccess: () => {
        toast({ title: "Scholarship deleted" })
        invalidate()
      },
      onError: (err: any) => {
        toast({ title: "Delete failed", description: String(err?.message ?? err), variant: "destructive" })
      },
    },
  })

  const statusMutation = useAdminSetScholarshipStatus({
    mutation: {
      onSuccess: () => {
        toast({ title: "Status updated" })
        invalidate()
      },
      onError: (err: any) => {
        toast({ title: "Update failed", description: String(err?.message ?? err), variant: "destructive" })
      },
    },
  })

  const verifyMutation = useAdminVerifyScholarship({
    mutation: {
      onSuccess: () => {
        toast({ title: "Verification status updated" })
        invalidate()
      },
      onError: (err: any) => {
        toast({ title: "Verification failed", description: String(err?.message ?? err), variant: "destructive" })
      },
    },
  })

  const scholarships = data?.scholarships ?? []

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Admin · Scholarships</h1>
            <p className="text-sm text-muted-foreground">
              Manage scholarship records. This area is not yet access-controlled — authentication will be added in a later step.
            </p>
          </div>
          <Link href="/admin/scholarships/new">
            <Button data-testid="button-new-scholarship">
              <Plus className="h-4 w-4 mr-2" /> New Scholarship
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading && <p className="text-muted-foreground">Loading scholarships…</p>}
        {isError && <p className="text-destructive">Failed to load scholarships.</p>}

        {!isLoading && !isError && scholarships.length === 0 && (
          <div className="text-center py-16 border rounded-lg bg-muted/30">
            <p className="text-muted-foreground mb-4">No scholarships yet.</p>
            <Link href="/admin/scholarships/new">
              <Button>Create the first scholarship</Button>
            </Link>
          </div>
        )}

        {scholarships.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Last verified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scholarships.map((s) => (
                  <TableRow key={s.id} data-testid={`row-scholarship-${s.id}`}>
                    <TableCell className="font-medium max-w-xs truncate">{s.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.providerName}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(s.status)}>{s.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={verificationBadgeVariant(s.verificationStatus)}>
                        {s.verificationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{s.deadline ?? "—"}</TableCell>
                    <TableCell className="text-sm">{s.lastVerifiedDate}</TableCell>
                    <TableCell className="text-right space-x-1 whitespace-nowrap">
                      <Button
                        size="icon"
                        variant="ghost"
                        title={s.verificationStatus === "verified" ? "Mark unverified" : "Mark verified"}
                        data-testid={`button-verify-${s.id}`}
                        onClick={() =>
                          verifyMutation.mutate({
                            id: s.id,
                            data: {
                              verificationStatus:
                                s.verificationStatus === "verified" ? "unverified" : "verified",
                            },
                          })
                        }
                      >
                        {s.verificationStatus === "verified" ? (
                          <ShieldCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <ShieldQuestion className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        data-testid={`button-toggle-status-${s.id}`}
                        onClick={() =>
                          statusMutation.mutate({
                            id: s.id,
                            data: { status: s.status === "active" ? "archived" : "active" },
                          })
                        }
                      >
                        {s.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Link href={`/admin/scholarships/${s.id}/edit`}>
                        <Button size="icon" variant="ghost" data-testid={`button-edit-${s.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        data-testid={`button-delete-${s.id}`}
                        onClick={() => setPendingDeleteId(s.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AlertDialog open={pendingDeleteId !== null} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this scholarship?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the scholarship along with its sources, eligibility criteria, and required documents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              data-testid="button-confirm-delete"
              onClick={() => {
                if (pendingDeleteId !== null) {
                  deleteMutation.mutate({ id: pendingDeleteId })
                  setPendingDeleteId(null)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
